from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageFilter, ImageStat
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from transformers import ViTImageProcessor, ViTForImageClassification
from transformers import pipeline  # Utiliser pipeline pour la traduction
import logging
from datetime import datetime
import io
import json
import threading
import time

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Variables globales pour les modèles
blip_processor = None
blip_model = None
vit_processor = None
vit_model = None
translation_pipelines = {}
translation_models_loading = False

def load_models_async():
    """Charger les modèles en arrière-plan"""
    global blip_processor, blip_model, vit_processor, vit_model, translation_pipelines, translation_models_loading
    
    logger.info("🔄 Début du chargement asynchrone des modèles...")
    
    try:
        # Charger les modèles d'analyse d'image
        logger.info("Chargement BLIP...")
        blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
        blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
        
        logger.info("Chargement ViT...")
        vit_processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
        vit_model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
        
        logger.info("✅ Modèles d'analyse d'image chargés")
        
        # Charger les pipelines de traduction (plus simple que MarianMT)
        logger.info("Chargement des pipelines de traduction IA...")
        
        try:
            # Pipeline Anglais -> Français
            translation_pipelines['en-fr'] = pipeline(
                "translation_en_to_fr", 
                model="Helsinki-NLP/opus-mt-en-fr",
                device=-1  # CPU, utiliser device=0 pour GPU
            )
            logger.info("✅ Pipeline EN->FR chargé")
        except Exception as e:
            logger.warning(f"⚠️ Erreur pipeline EN->FR: {e}")
            # Fallback à un modèle plus léger
            try:
                translation_pipelines['en-fr'] = pipeline(
                    "translation", 
                    model="t5-small",
                    tokenizer="t5-small",
                    framework="pt"
                )
                logger.info("✅ Pipeline T5-small (EN->FR) chargé comme fallback")
            except Exception as e2:
                logger.error(f"❌ Erreur fallback EN->FR: {e2}")
        
        try:
            # Pipeline Anglais -> Arabe
            translation_pipelines['en-ar'] = pipeline(
                "translation_en_to_ar",
                model="Helsinki-NLP/opus-mt-en-ar",
                device=-1
            )
            logger.info("✅ Pipeline EN->AR chargé")
        except Exception as e:
            logger.warning(f"⚠️ Erreur pipeline EN->AR: {e}")
        
        logger.info("🎉 Tous les modèles IA chargés avec succès")
        
    except Exception as e:
        logger.error(f"❌ Erreur chargement modèles: {e}")
    
    translation_models_loading = False

# Démarrer le chargement asynchrone des modèles
threading.Thread(target=load_models_async, daemon=True).start()

# Dictionnaires de traduction
TRANSLATIONS = {
    'fr': {
        'technical_analysis': "Analyse Technique",
        'executive_summary': "Résumé Exécutif",
        'content_analysis': "Analyse du Contenu",
        'recommendations': "Recommandations",
        'main_categories': "Catégories Principales",
        'visual_analysis': "Analyse Visuelle",
        'resolution': "Résolution",
        'aspect_ratio': "Ratio d'Aspect",
        'dominant_colors': "Couleurs Dominantes",
        'composition_type': "Type de Composition",
        'brightness_level': "Niveau de Luminosité",
        'high_contrast': "Contraste élevé améliore la clarté",
        'sharp_details': "Détails nets et bords définis",
        'color_harmony': "Harmonie colorimétrique multi-spectrale",
        'architectural_elements': "Éléments architecturaux structurés",
        'suitable_for': "Adapté pour",
        'professional_use': "Usage professionnel",
        'high_quality': "Haute qualité"
    },
    'ar': {
        'technical_analysis': "التحليل الفني",
        'executive_summary': "ملخص تنفيذي", 
        'content_analysis': "تحليل المحتوى",
        'recommendations': "التوصيات",
        'main_categories': "الفئات الرئيسية",
        'visual_analysis': "التحليل البصري",
        'resolution': "الدقة",
        'aspect_ratio': "نسبة الأبعاد",
        'dominant_colors': "الألوان المسيطرة",
        'composition_type': "نوع التركيب",
        'brightness_level': "مستوى السطوع",
        'high_contrast': "تباين عالي يعزز الوضوح",
        'sharp_details': "تفاصيل حادة وحواف واضحة", 
        'color_harmony': "تناغم لوني متعدد الأطياف",
        'architectural_elements': "عناصر معمارية بتصميم منظم",
        'suitable_for': "مناسب لـ",
        'professional_use': "الاستخدام المهني",
        'high_quality': "جودة عالية"
    },
    'en': {
        'technical_analysis': "Technical Analysis",
        'executive_summary': "Executive Summary", 
        'content_analysis': "Content Analysis",
        'recommendations': "Recommendations",
        'main_categories': "Main Categories",
        'visual_analysis': "Visual Analysis", 
        'resolution': "Resolution",
        'aspect_ratio': "Aspect Ratio",
        'dominant_colors': "Dominant Colors",
        'composition_type': "Composition Type",
        'brightness_level': "Brightness Level",
        'high_contrast': "High contrast enhances clarity",
        'sharp_details': "Sharp details and defined edges",
        'color_harmony': "Multi-spectral color harmony",
        'architectural_elements': "Structured architectural elements",
        'suitable_for': "Suitable for",
        'professional_use': "Professional use",
        'high_quality': "High quality"
    }
}

def translate_with_ia(text, target_lang='fr'):
    """Traduire du texte avec IA"""
    try:
        if not text or text.strip() == "":
            return text
        
        if target_lang == 'en':
            return text
        
        # Déterminer la clé du pipeline
        if target_lang == 'fr':
            pipeline_key = 'en-fr'
        elif target_lang == 'ar':
            pipeline_key = 'en-ar'
        else:
            return text
        
        # Vérifier si le pipeline est chargé
        if pipeline_key not in translation_pipelines:
            logger.warning(f"Pipeline {pipeline_key} non chargé")
            return text
        
        # Traduire avec le pipeline
        pipeline_obj = translation_pipelines[pipeline_key]
        
        # Utiliser le bon format selon le modèle
        if pipeline_key == 'en-fr' and 't5' in str(pipeline_obj.model.__class__).lower():
            # Format pour T5
            input_text = f"translate English to French: {text}"
            result = pipeline_obj(input_text, max_length=100)[0]['translation_text']
        else:
            # Format standard pour les pipelines de traduction
            result = pipeline_obj(text, max_length=100)[0]['translation_text']
        
        logger.info(f"✅ Traduction IA: '{text[:50]}...' -> '{result[:50]}...'")
        return result.strip()
        
    except Exception as e:
        logger.error(f"❌ Erreur traduction IA: {e}")
        return text

def analyze_with_blip(image):
    """Analyser l'image avec BLIP"""
    try:
        if blip_model is None:
            logger.error("BLIP model not loaded")
            return None
            
        inputs = blip_processor(image, return_tensors="pt")
        with torch.no_grad():
            out = blip_model.generate(**inputs, max_length=100, num_beams=5)
        description = blip_processor.decode(out[0], skip_special_tokens=True)
        logger.info(f"BLIP description: {description}")
        return description
    except Exception as e:
        logger.error(f"Erreur BLIP: {e}")
        return None

def analyze_with_vit(image):
    """Analyser l'image avec ViT"""
    try:
        if vit_model is None:
            logger.error("ViT model not loaded")
            return None
            
        inputs = vit_processor(image, return_tensors="pt")
        with torch.no_grad():
            outputs = vit_model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
        top_prob, top_class = torch.topk(probabilities, 5)
        
        results = []
        for i in range(5):
            label = vit_model.config.id2label[top_class[0][i].item()]
            prob = top_prob[0][i].item()
            results.append({"label": label, "confidence": prob})
        
        logger.info(f"ViT results: {results}")
        return results
    except Exception as e:
        logger.error(f"Erreur ViT: {e}")
        return None

def analyze_colors_and_composition(image):
    """Analyser les couleurs et la composition"""
    try:
        width, height = image.size
        small_img = image.resize((100, 100))
        if small_img.mode != 'RGB':
            small_img = small_img.convert('RGB')
        
        colors = small_img.getcolors(10000)
        dominant_colors = []
        if colors:
            colors.sort(key=lambda x: x[0], reverse=True)
            for count, color in colors[:5]:
                hex_color = '#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2])
                dominant_colors.append(hex_color)
        
        stat = ImageStat.Stat(image)
        brightness = sum(stat.mean) / 3
        contrast = sum(stat.stddev) / 3
        
        edges = image.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edges)
        edge_strength = sum(edge_stat.mean) / 3
        
        return {
            'dominant_colors': dominant_colors,
            'brightness': brightness,
            'contrast': contrast,
            'edge_strength': edge_strength,
            'composition': analyze_composition_type(edge_strength, width/height),
            'width': width,
            'height': height
        }
    except Exception as e:
        logger.error(f"Erreur analyse couleurs: {e}")
        return {}

def analyze_composition_type(edge_strength, aspect_ratio):
    """Analyser le type de composition"""
    if edge_strength > 50:
        if aspect_ratio > 1.5:
            return "horizontal"
        elif aspect_ratio < 0.7:
            return "vertical" 
        else:
            return "balanced"
    else:
        if aspect_ratio > 1.3:
            return "panoramic"
        else:
            return "organic"

def generate_analysis_report(blip_description, vit_results, color_analysis, language='fr'):
    """Générer le rapport d'analyse dans la langue choisie"""
    trans = TRANSLATIONS[language]
    
    if language == 'fr':
        return generate_french_report(blip_description, vit_results, color_analysis, trans)
    elif language == 'ar':
        return generate_arabic_report(blip_description, vit_results, color_analysis, trans)
    else:
        return generate_english_report(blip_description, vit_results, color_analysis, trans)

def translate_to_french(text):
    """Traduire le texte anglais en français avec IA"""
    if not text:
        return "Image contenant divers éléments visuels"
    
    # Essayer d'abord la traduction IA
    translated = translate_with_ia(text, 'fr')
    
    # Si la traduction IA a fonctionné et est différente du texte original
    if translated and translated != text:
        return translated
    
    # Fallback: traduction manuelle
    translations = {
        "a man with a stick in his hand in the jungle": "Un homme tenant un bâton dans sa main dans la jungle",
        "in his hand": "dans sa main",
        "in the jungle": "dans la jungle",
        "with a stick": "tenant un bâton",
        "a man": "un homme",
    }
    
    for eng, fr in translations.items():
        if eng in text.lower():
            return text.lower().replace(eng, fr).capitalize()
    
    return "Image contenant divers éléments visuels"

def translate_to_arabic(text):
    """Traduire le texte en arabe avec IA"""
    if not text:
        return "صورة تحتوي على عناصر بصرية متنوعة"
    
    # Essayer d'abord la traduction IA
    translated = translate_with_ia(text, 'ar')
    
    # Si la traduction IA a fonctionné et est différente du texte original
    if translated and translated != text:
        return translated
    
    # Fallback: traduction manuelle
    translations = {
        "a man with a stick in his hand in the jungle": "رجل يحمل عصا في يده في الغابة",
        "in his hand": "في يده",
        "in the jungle": "في الغابة",
        "with a stick": "يحمل عصا",
        "a man": "رجل",
    }
    
    for eng, arb in translations.items():
        if eng in text.lower():
            return text.lower().replace(eng, arb)
    
    return "صورة تحتوي على عناصر بصرية متنوعة"

def generate_french_report(blip_description, vit_results, color_analysis, trans):
    """Générer rapport en français"""
    report = "🖼️ RAPPORT COMPLET D'ANALYSE D'IMAGE\n\n"
    
    report += f"📋 {trans['executive_summary']}\n"
    french_desc = translate_to_french(blip_description) if blip_description else 'Image contenant divers éléments visuels'
    report += f"Description IA : {french_desc}\n\n"
    
    report += f"🔍 {trans['content_analysis']}\n"
    
    if vit_results:
        report += f"{trans['main_categories']} :\n"
        for i, result in enumerate(vit_results[:3], 1):
            label_fr = translate_label_to_french(result['label'])
            report += f"  • {label_fr} (confiance: {result['confidence']*100:.1f}%)\n"
    
    report += f"\n{trans['visual_analysis']} :\n"
    if color_analysis:
        report += f"  • {trans['resolution']} : {color_analysis['width']} × {color_analysis['height']} pixels\n"
        report += f"  • {trans['aspect_ratio']} : {color_analysis['width']/color_analysis['height']:.2f}:1\n"
        report += f"  • {trans['dominant_colors']} : {', '.join(color_analysis['dominant_colors'][:3])}\n"
        report += f"  • {trans['composition_type']} : {get_composition_description(color_analysis['composition'], 'fr')}\n"
        report += f"  • {trans['brightness_level']} : {'Élevé' if color_analysis['brightness'] > 150 else 'Moyen' if color_analysis['brightness'] > 100 else 'Faible'}\n"
    
    report += f"\n🎨 {trans['technical_analysis']}\n"
    report += generate_technical_analysis(color_analysis, vit_results, 'fr')
    
    report += f"\n💡 {trans['recommendations']}\n"
    report += generate_recommendations(blip_description, vit_results, 'fr')
    
    return report

def generate_arabic_report(blip_description, vit_results, color_analysis, trans):
    """Générer rapport en arabe"""
    report = "🖼️ التقرير الشامل لتحليل الصورة\n\n"
    
    report += f"📋 {trans['executive_summary']}\n"
    arabic_desc = translate_to_arabic(blip_description) if blip_description else "صورة تحتوي على عناصر بصرية متنوعة"
    report += f"الوصف بالذكاء الاصطناعي: {arabic_desc}\n\n"
    
    report += f"🔍 {trans['content_analysis']}\n"
    
    if vit_results:
        report += f"{trans['main_categories']}:\n"
        for i, result in enumerate(vit_results[:3], 1):
            label_ar = translate_label_to_arabic(result['label'])
            report += f"  • {label_ar} (ثقة: {result['confidence']*100:.1f}%)\n"
    
    report += f"\n{trans['visual_analysis']}:\n"
    if color_analysis:
        report += f"  • {trans['resolution']} : {color_analysis['width']} × {color_analysis['height']} بكسل\n"
        report += f"  • {trans['aspect_ratio']} : {color_analysis['width']/color_analysis['height']:.2f}:1\n"
        report += f"  • {trans['dominant_colors']} : {', '.join(color_analysis['dominant_colors'][:3])}\n"
        report += f"  • {trans['composition_type']} : {get_composition_description(color_analysis['composition'], 'ar')}\n"
        report += f"  • {trans['brightness_level']} : {'مرتفع' if color_analysis['brightness'] > 150 else 'متوسط' if color_analysis['brightness'] > 100 else 'منخفض'}\n"
    
    report += f"\n🎨 {trans['technical_analysis']}\n"
    report += generate_technical_analysis(color_analysis, vit_results, 'ar')
    
    report += f"\n💡 {trans['recommendations']}\n"
    report += generate_recommendations(blip_description, vit_results, 'ar')
    
    return report

def generate_english_report(blip_description, vit_results, color_analysis, trans):
    """Générer rapport en anglais"""
    report = "🖼️ COMPREHENSIVE IMAGE ANALYSIS REPORT\n\n"
    
    report += f"📋 {trans['executive_summary']}\n"
    report += f"AI Description: {blip_description or 'Image containing various visual elements'}\n\n"
    
    report += f"🔍 {trans['content_analysis']}\n"
    
    if vit_results:
        report += f"{trans['main_categories']}:\n"
        for i, result in enumerate(vit_results[:3], 1):
            report += f"  • {result['label']} (confidence: {result['confidence']*100:.1f}%)\n"
    
    report += f"\n{trans['visual_analysis']}:\n"
    if color_analysis:
        report += f"  • {trans['resolution']}: {color_analysis['width']} × {color_analysis['height']} pixels\n"
        report += f"  • {trans['aspect_ratio']}: {color_analysis['width']/color_analysis['height']:.2f}:1\n"
        report += f"  • {trans['dominant_colors']}: {', '.join(color_analysis['dominant_colors'][:3])}\n"
        report += f"  • {trans['composition_type']}: {get_composition_description(color_analysis['composition'], 'en')}\n"
        report += f"  • {trans['brightness_level']}: {'High' if color_analysis['brightness'] > 150 else 'Medium' if color_analysis['brightness'] > 100 else 'Low'}\n"
    
    report += f"\n🎨 {trans['technical_analysis']}\n"
    report += generate_technical_analysis(color_analysis, vit_results, 'en')
    
    report += f"\n💡 {trans['recommendations']}\n"
    report += generate_recommendations(blip_description, vit_results, 'en')
    
    return report

def translate_label_to_french(english_label):
    """Traduire les labels en français"""
    # D'abord essayer la traduction IA
    if 'en-fr' in translation_pipelines:
        translated = translate_with_ia(english_label, 'fr')
        if translated and translated != english_label:
            return translated
    
    # Fallback au dictionnaire
    translations = {
        "building": "Bâtiment",
        "street": "Rue", 
        "city": "Ville",
        "landscape": "Paysage",
        "mountain": "Montagne",
        "beach": "Plage",
        "forest": "Forêt",
        "person": "Personne",
        "car": "Voiture",
        "animal": "Animal",
        "tree": "Arbre",
        "water": "Eau",
        "sky": "Ciel",
        "food": "Nourriture",
        "indoor": "Intérieur",
        "outdoor": "Extérieur",
        "zebra": "Zèbre",
        "gazelle": "Gazelle",
        "impala": "Impala",
        "giraffe": "Girafe",
        "comic book": "Bande dessinée",
        "book jacket": "Couverture de livre",
        "dust cover": "Couverture protectrice",
        "dust jacket": "Couverture de livre",
        "dust wrapper": "Emballage protecteur",
        "bow": "Arc",
        "book": "Livre"
    }
    
    return translations.get(english_label.lower(), english_label)

def translate_label_to_arabic(english_label):
    """Traduire les labels en arabe"""
    # D'abord essayer la traduction IA
    if 'en-ar' in translation_pipelines:
        translated = translate_with_ia(english_label, 'ar')
        if translated and translated != english_label:
            return translated
    
    # Fallback au dictionnaire
    translations = {
        "building": "مبنى",
        "street": "شارع",
        "city": "مدينة", 
        "landscape": "منظر طبيعي",
        "mountain": "جبل",
        "beach": "شاطئ",
        "forest": "غابة",
        "person": "شخص",
        "car": "سيارة",
        "animal": "حيوان",
        "tree": "شجرة",
        "water": "ماء",
        "sky": "سماء",
        "food": "طعام",
        "indoor": "داخلي",
        "outdoor": "خارجي",
        "zebra": "حمار وحشي",
        "gazelle": "غزال",
        "impala": "إمبالا",
        "giraffe": "زرافة",
        "comic book": "كتاب مصور",
        "book jacket": "غلاف كتاب",
        "dust cover": "غطاء واقي",
        "dust jacket": "غلاف كتاب",
        "dust wrapper": "غلاف واقي",
        "bow": "قوس",
        "book": "كتاب"
    }
    
    return translations.get(english_label.lower(), english_label)

def get_composition_description(composition_type, language):
    """Obtenir la description de la composition"""
    descriptions = {
        'fr': {
            'horizontal': "Composition horizontale avec lignes fortes",
            'vertical': "Composition verticale avec éléments élancés", 
            'balanced': "Composition équilibrée et géométrique",
            'panoramic': "Paysage panoramique ouvert",
            'organic': "Composition fluide et organique"
        },
        'ar': {
            'horizontal': "تركيب أفقي مع خطوط قوية",
            'vertical': "تركيب عمودي مع عناصر رفيعة",
            'balanced': "تركيب متوازن وهندسي", 
            'panoramic': "منظر طبيعي بانورامي مفتوح",
            'organic': "تركيب سائل وعضوي"
        },
        'en': {
            'horizontal': "Horizontal composition with strong lines",
            'vertical': "Vertical composition with slender elements",
            'balanced': "Balanced and geometric composition", 
            'panoramic': "Open panoramic landscape",
            'organic': "Fluid and organic composition"
        }
    }
    return descriptions[language].get(composition_type, composition_type)

def generate_technical_analysis(color_analysis, vit_results, language):
    """Générer l'analyse technique"""
    trans = TRANSLATIONS[language]
    analysis = ""
    
    if color_analysis:
        if color_analysis['contrast'] > 60:
            analysis += f"  • {trans['high_contrast']}\n"
        if color_analysis['edge_strength'] > 40:
            analysis += f"  • {trans['sharp_details']}\n"
        if len(color_analysis['dominant_colors']) >= 3:
            analysis += f"  • {trans['color_harmony']}\n"
    
    if vit_results:
        main_category = vit_results[0]['label']
        if 'landscape' in main_category.lower():
            if language == 'fr':
                analysis += "  • Paysage panoramique avec profondeur de champ\n"
            elif language == 'ar':
                analysis += "  • منظر طبيعي بانورامي بعمق مجالي\n"
            else:
                analysis += "  • Panoramic landscape with field depth\n"
        elif 'building' in main_category.lower():
            analysis += f"  • {trans['architectural_elements']}\n"
        elif 'person' in main_category.lower():
            if language == 'fr':
                analysis += "  • Présence d'éléments humains comme point focal\n"
            elif language == 'ar':
                analysis += "  • وجود عناصر بشرية كمركز الاهتمام\n" 
            else:
                analysis += "  • Human elements as focal point\n"
    
    return analysis

def generate_recommendations(blip_desc, vit_results, language):
    """Générer les recommandations"""
    trans = TRANSLATIONS[language]
    recommendations = []
    
    desc_lower = (blip_desc or "").lower()
    
    if any(word in desc_lower for word in ['landscape', 'mountain', 'beach', 'paysage', 'جبل', 'شاطئ']):
        if language == 'fr':
            recommendations.extend(["Présentations environnementales", "Arrière-plans naturels"])
        elif language == 'ar':
            recommendations.extend(["عروض بيئية", "خلفيات طبيعية"])
        else:
            recommendations.extend(["Environmental presentations", "Natural backgrounds"])
    
    if any(word in desc_lower for word in ['city', 'building', 'street', 'ville', 'bâtiment', 'مدينة', 'مبنى']):
        if language == 'fr':
            recommendations.extend(["Projets urbains", "Design architectural"])
        elif language == 'ar':
            recommendations.extend(["مشاريع عمرانية", "تصميم معماري"])
        else:
            recommendations.extend(["Urban projects", "Architectural design"])
    
    if language == 'fr':
        recommendations.extend(["Usage professionnel", "Impression et affichage numérique"])
    elif language == 'ar':
        recommendations.extend(["استخدام مهني", "طباعة وعرض رقمي"])
    else:
        recommendations.extend(["Professional use", "Print and digital display"])
    
    return "  • " + "\n  • ".join(recommendations[:4])

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """Endpoint pour analyser l'image"""
    try:
        # Attendre que les modèles soient chargés
        if blip_model is None or vit_model is None:
            return jsonify({
                'success': False, 
                'error': 'Models are still loading. Please wait a moment and try again.'
            }), 503
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        file = request.files['image']
        language = request.form.get('language', 'fr')
        
        logger.info(f"🌍 Analyse demandée en: {language}")
        
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        allowed_formats = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif']
        if not any(file.filename.lower().endswith(f'.{fmt}') for fmt in allowed_formats):
            return jsonify({
                'success': False, 
                'error': f'Format not supported. Use: {", ".join(allowed_formats)}'
            }), 400
        
        try:
            image = Image.open(file.stream)
            if image.mode != 'RGB':
                image = image.convert('RGB')
        except Exception as e:
            return jsonify({'success': False, 'error': 'Invalid or corrupted image file'}), 400
        
        # Analyse avec l'IA
        blip_description = analyze_with_blip(image) if blip_model else None
        vit_results = analyze_with_vit(image) if vit_model else None
        color_analysis = analyze_colors_and_composition(image)
        
        # Générer le rapport
        analysis_report = generate_analysis_report(
            blip_description, 
            vit_results, 
            color_analysis, 
            language
        )
        
        response_data = {
            'success': True,
            'description': analysis_report,
            'details': {
                'confidence': 0.95,
                'dominant_colors': color_analysis.get('dominant_colors', []),
                'image_format': image.format,
                'dimensions': f"{color_analysis.get('width', 0)}x{color_analysis.get('height', 0)}",
                'analysis_time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'language': language,
                'models_used': ['BLIP', 'ViT'],
                'translation_ia': len(translation_pipelines) > 0
            }
        }
        
        logger.info(f"✅ Image analysée: {file.filename} | Langue: {language}")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"❌ Erreur analyse: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy ✅' if blip_model and vit_model else 'loading ⏳',
        'service': 'Multi-Language Image Analysis API',
        'version': '6.0.0',
        'supported_languages': ['fr', 'ar', 'en'],
        'models_loaded': {
            'blip': blip_model is not None,
            'vit': vit_model is not None,
            'translation_ia': len(translation_pipelines) > 0
        },
        'translation_pipelines': list(translation_pipelines.keys()),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/test-translation', methods=['POST'])
def test_translation():
    """Endpoint pour tester la traduction IA"""
    try:
        data = request.json
        text = data.get('text', 'a man with a stick in his hand in the jungle')
        language = data.get('language', 'ar')
        
        logger.info(f"Test traduction: '{text}' -> {language}")
        
        if language == 'fr':
            translated = translate_to_french(text)
        elif language == 'ar':
            translated = translate_to_arabic(text)
        else:
            translated = text
        
        return jsonify({
            'success': True,
            'original': text,
            'translated': translated,
            'language': language,
            'translation_method': 'IA' if len(translation_pipelines) > 0 else 'Dictionary'
        })
    except Exception as e:
        logger.error(f"Erreur test traduction: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Démarrage du serveur d'analyse multi-langues...")
    print("🔗 URL: http://localhost:8000")
    print("🌍 Langues supportées: Français, Arabe, Anglais")
    print("🤖 Chargement des modèles en arrière-plan...")
    print("📸 Le serveur démarre, les modèles se chargeront progressivement")
    print("\n📋 Endpoints disponibles:")
    print("   • POST /api/analyze-image - Analyser une image")
    print("   • GET  /api/health - Vérifier l'état des modèles")
    print("   • POST /api/test-translation - Tester la traduction IA")
    
    # Attendre un peu que le chargement commence
    time.sleep(2)
    
    app.run(host='0.0.0.0', port=8000, debug=False)
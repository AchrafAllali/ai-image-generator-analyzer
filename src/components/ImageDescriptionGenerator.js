import React, { useState, useRef } from 'react';
import './ImageDescriptionGenerator.css';

const ImageDescriptionGenerator = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysisDetails, setAnalysisDetails] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [copyFeedback, setCopyFeedback] = useState('');
  const fileInputRef = useRef(null);

  // Types de fichiers acceptés
  const acceptedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'];

  // Langues supportées
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (!acceptedFormats.some(format => file.name.toLowerCase().endsWith(format))) {
      setError(`Format non supporté. Utilisez: ${acceptedFormats.join(', ')}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 10MB');
      return;
    }

    setError('');
    setSelectedImage(file);
    setDescription('');
    setAnalysisDetails(null);

    // Créer l'URL de prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const inputEvent = {
        target: { files: [file] }
      };
      handleImageSelect(inputEvent);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setDescription('');
    setAnalysisDetails(null);

    try {
      // Créer un FormData pour l'envoi
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('language', selectedLanguage);

      // Appel à l'API Python
      const response = await fetch('http://localhost:8000/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDescription(data.description);
        setAnalysisDetails(data.details || {});
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

    } catch (err) {
      console.error('Erreur analyse:', err);
      
      // Simulation en cas d'erreur de connexion
      if (err.message.includes('Failed to fetch')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le serveur Python est démarré.');
        // Simulation pour la démo
        simulateAnalysis();
      } else {
        setError(`Erreur: ${err.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulation d'analyse pour la démo
  const simulateAnalysis = () => {
    setTimeout(() => {
      const mockDescriptions = {
        fr: `## 🖼️ RAPPORT COMPLET D'ANALYSE D'IMAGE

### 📋 Résumé Exécutif
**Description IA :** Ville urbaine avec bâtiments modernes et ciel bleu

### 🔍 Analyse du Contenu
**Catégories Principales :**
• Bâtiment (confiance: 92.3%)
• Ville (confiance: 85.7%)
• Rue (confiance: 78.2%)

**Analyse Visuelle :**
• Résolution : 1200 × 600 pixels
• Ratio d'Aspect : 2.00:1
• Couleurs Dominantes : #42318, #16113, #76884e
• Type de Composition : Composition horizontale avec lignes fortes
• Niveau de Luminosité : Moyen

### 🎨 Analyse Technique
• Contraste élevé améliore la clarté
• Détails nets et bords définis
• Éléments architecturaux structurés

### 💡 Recommandations
• Projets urbains
• Design architectural
• Usage professionnel
• Impression et affichage numérique`,

        ar: `## 🖼️ التقرير الشامل لتحليل الصورة

### 📋 ملخص تنفيذي
**الوصف بالذكاء الاصطناعي:** مدينة حضرية مع مباني حديثة وسماء زرقاء

### 🔍 تحليل المحتوى
**الفئات الرئيسية:**
• مبنى (ثقة: 92.3%)
• مدينة (ثقة: 85.7%)
• شارع (ثقة: 78.2%)

**التحليل البصري:**
• الدقة : 1200 × 600 بكسل
• نسبة الأبعاد : 2.00:1
• الألوان المسيطرة : #42318, #16113, #76884e
• نوع التركيب : تركيب أفقي مع خطوط قوية
• مستوى السطوع : متوسط

### 🎨 التحليل الفني
• تباين عالي يعزز الوضوح
• تفاصيل حادة وحواف واضحة
• عناصر معمارية بتصميم منظم

### 💡 التوصيات
• مشاريع عمرانية
• تصميم معماري
• استخدام مهني
• طباعة وعرض رقمي`,

        en: `## 🖼️ COMPREHENSIVE IMAGE ANALYSIS REPORT

### 📋 Executive Summary
**AI Description:** Urban city with modern buildings and blue sky

### 🔍 Content Analysis
**Main Categories:**
• Building (confidence: 92.3%)
• City (confidence: 85.7%)
• Street (confidence: 78.2%)

**Visual Analysis:**
• Resolution: 1200 × 600 pixels
• Aspect Ratio: 2.00:1
• Dominant Colors: #42318, #16113, #76884e
• Composition Type: Horizontal composition with strong lines
• Brightness Level: Medium

### 🎨 Technical Analysis
• High contrast enhances clarity
• Sharp details and defined edges
• Structured architectural elements

### 💡 Recommendations
• Urban projects
• Architectural design
• Professional use
• Print and digital display`
      };

      setDescription(mockDescriptions[selectedLanguage]);
      setAnalysisDetails({
        confidence: 0.92,
        dominant_colors: ['#42318', '#16113', '#76884e'],
        language: selectedLanguage
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setDescription('');
    setAnalysisDetails(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    if (!description) return;

    try {
      // Utiliser l'API moderne du presse-papier
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(description);
      } else {
        // Fallback pour les anciens navigateurs
        const textarea = document.createElement('textarea');
        textarea.value = description;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Message de succès
      const messages = {
        fr: '✅ Rapport copié avec succès !',
        ar: '✅ تم نسخ التقرير بنجاح!',
        en: '✅ Report copied successfully!'
      };
      
      setCopyFeedback(messages[selectedLanguage]);
      setTimeout(() => setCopyFeedback(''), 3000);

    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      const errorMessages = {
        fr: '❌ Erreur lors de la copie',
        ar: '❌ خطأ في النسخ',
        en: '❌ Copy error'
      };
      setCopyFeedback(errorMessages[selectedLanguage]);
      setTimeout(() => setCopyFeedback(''), 3000);
    }
  };

  // Textes dynamiques selon la langue
  const getText = (key) => {
    const texts = {
      // Titres
      title: {
        fr: 'Analyse d\'Image par IA',
        ar: 'محلل الصور بالذكاء الاصطناعي',
        en: 'AI Image Analyzer'
      },
      subtitle: {
        fr: 'Intelligence Artificielle • Analyse détaillée • Multi-langues',
        ar: 'ذكاء اصطناعي • تحليل مفصل • متعدد اللغات',
        en: 'Artificial Intelligence • Detailed Analysis • Multi-language'
      },
      
      // Section Upload
      importTitle: {
        fr: 'Importation de l\'Image',
        ar: 'استيراد الصورة',
        en: 'Image Import'
      },
      dragDrop: {
        fr: 'Glissez-déposez votre image ici',
        ar: 'اسحب وأفلت صورتك هنا',
        en: 'Drag & drop your image here'
      },
      clickBrowse: {
        fr: 'ou cliquez pour parcourir',
        ar: 'أو انقر للتصفح',
        en: 'or click to browse'
      },
      formats: {
        fr: 'Formats supportés: jpg, jpeg, png, webp, bmp, gif • Max 10MB',
        ar: 'الصيغ المدعومة: jpg, jpeg, png, webp, bmp, gif • الحد الأقصى 10MB',
        en: 'Supported formats: jpg, jpeg, png, webp, bmp, gif • Max 10MB'
      },
      
      // Preview
      preview: {
        fr: 'Aperçu de l\'image',
        ar: 'معاينة الصورة',
        en: 'Image Preview'
      },
      file: {
        fr: 'Fichier:',
        ar: 'الملف:',
        en: 'File:'
      },
      size: {
        fr: 'Taille:',
        ar: 'الحجم:',
        en: 'Size:'
      },
      
      // Bouton Analyse
      analyzing: {
        fr: 'Analyse en cours par l\'IA...',
        ar: 'جاري التحليل بالذكاء الاصطناعي...',
        en: 'AI analysis in progress...'
      },
      analyze: {
        fr: 'Analyser l\'Image avec l\'IA',
        ar: 'تحليل الصورة بالذكاء الاصطناعي',
        en: 'Analyze Image with AI'
      },
      
      // Résultats
      resultsTitle: {
        fr: '📋 Rapport Généré par l\'IA',
        ar: '📋 التقرير المُنشئ بالذكاء الاصطناعي',
        en: '📋 AI Generated Report'
      },
      analysis: {
        fr: 'Analyse Détaillée',
        ar: 'التحليل التفصيلي',
        en: 'Detailed Analysis'
      },
      copy: {
        fr: '📋 Copier',
        ar: '📋 نسخ',
        en: '📋 Copy'
      },
      
      // Métriques
      metrics: {
        fr: '📊 Métriques d\'Analyse',
        ar: '📊 مقاييس التحليل',
        en: '📊 Analysis Metrics'
      },
      confidence: {
        fr: 'Confiance IA',
        ar: 'ثقة الذكاء الاصطناعي',
        en: 'AI Confidence'
      },
      colors: {
        fr: 'Couleurs Dominantes',
        ar: 'الألوان المسيطرة',
        en: 'Dominant Colors'
      },
      style: {
        fr: 'Style',
        ar: 'النمط',
        en: 'Style'
      },
      mood: {
        fr: 'Ambiance',
        ar: 'الجو',
        en: 'Mood'
      },
      
      // Actions
      newAnalysis: {
        fr: '🔄 Analyser une Autre Image',
        ar: '🔄 تحليل صورة أخرى',
        en: '🔄 Analyze Another Image'
      },
      
      // Guide
      guide: {
        fr: '🎯 Comment Obtenir les Meilleurs Résultats',
        ar: '🎯 كيفية الحصول على أفضل النتائج',
        en: '🎯 How to Get the Best Results'
      },
      quality: {
        fr: 'Qualité d\'Image',
        ar: 'جودة الصورة',
        en: 'Image Quality'
      },
      qualityDesc: {
        fr: 'Utilisez des images nettes et bien éclairées pour une analyse optimale',
        ar: 'استخدم صورًا واضحة ومضاءة جيدًا للحصول على تحليل أمثل',
        en: 'Use sharp and well-lit images for optimal analysis'
      },
      content: {
        fr: 'Contenu Riche',
        ar: 'محتوى غني',
        en: 'Rich Content'
      },
      contentDesc: {
        fr: 'Les images avec des détails visuels complexes donnent de meilleures descriptions',
        ar: 'الصور ذات التفاصيل البصرية المعقدة تعطي أوصافًا أفضل',
        en: 'Images with complex visual details give better descriptions'
      },
      performance: {
        fr: 'Performance',
        ar: 'الأداء',
        en: 'Performance'
      },
      performanceDesc: {
        fr: 'L\'analyse prend généralement 2-5 secondes selon la complexité',
        ar: 'يستغرق التحليل عادة من 2 إلى 5 ثوانٍ حسب التعقيد',
        en: 'Analysis typically takes 2-5 seconds depending on complexity'
      }
    };

    return texts[key]?.[selectedLanguage] || key;
  };

  return (
    <div className="image-description-container">
      
      {/* Feedback de copie */}
      {copyFeedback && (
        <div className="copy-feedback">
          {copyFeedback}
        </div>
      )}
      
      <div className="description-wrapper">
        
        {/* En-tête avec sélecteur de langue */}
        <div className="description-header">
          <div className="header-content">
            <span className="header-icon">🔍</span>
            <h1>{getText('title')}</h1>
          </div>
          <p className="header-subtitle">{getText('subtitle')}</p>

          {/* Badges Animés Professionnels */}
          <div className="animated-badges">
            <div className="badge">
              <span className="badge-icon">🤖</span>
              {selectedLanguage === 'fr' ? 'IA Avancée' : 
               selectedLanguage === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI'}
            </div>
            <div className="badge">
              <span className="badge-icon">⚡</span>
              {selectedLanguage === 'fr' ? 'Analyse Rapide' : 
               selectedLanguage === 'ar' ? 'تحليل سريع' : 'Fast Analysis'}
            </div>
            <div className="badge">
              <span className="badge-icon">🌍</span>
              {selectedLanguage === 'fr' ? 'Multi-Langues' : 
               selectedLanguage === 'ar' ? 'متعدد اللغات' : 'Multi-Language'}
            </div>
          </div>

          {/* Sélecteur de langue */}
          <div className="language-selector">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`lang-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <span className="flag">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="description-content">
          
          {/* Zone d'Upload */}
          <div className="upload-section">
            <h3 className="section-title">{getText('importTitle')}</h3>
            
            <div 
              className="upload-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept={acceptedFormats.join(',')}
                className="file-input"
              />
              
              <div className="upload-content">
                <span className="upload-icon">📁</span>
                <div className="upload-text">
                  <h4>{getText('dragDrop')}</h4>
                  <p>{getText('clickBrowse')}</p>
                </div>
                <div className="format-info">
                  {getText('formats')}
                </div>
              </div>
            </div>

            {previewUrl && (
              <div className="preview-section">
                <h4>{getText('preview')}</h4>
                <div className="image-preview">
                  <img src={previewUrl} alt="Aperçu" className="preview-image" />
                  <div className="preview-overlay">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAnalysis();
                      }}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <span>{getText('file')} {selectedImage?.name}</span>
                  <span>{getText('size')} {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Bouton d'Analyse */}
          {previewUrl && (
            <div className="analysis-section">
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="analyze-btn"
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    {getText('analyzing')}
                  </>
                ) : (
                  <>
                    <span className="analyze-icon">🤖</span>
                    {getText('analyze')}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Messages d'Erreur */}
          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <div>
                <p><strong>
                  {selectedLanguage === 'ar' ? 'خطأ:' : 
                   selectedLanguage === 'fr' ? 'Erreur:' : 'Error:'}
                </strong> {error}</p>
              </div>
            </div>
          )}

          {/* Résultats de l'Analyse */}
          {description && (
            <div className="results-section">
              <h3 className="results-title">
                {getText('resultsTitle')}
              </h3>

              {/* Boîte de description avec bouton copie FIXÉ */}
              <div className="description-box">
                <div className="description-header-box">
                  <h4>{getText('analysis')}</h4>
                  <button
                    onClick={copyToClipboard}
                    className="copy-btn"
                  >
                    {getText('copy')}
                  </button>
                </div>
                <div className="description-content-box">
                  <pre className="analysis-text" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {description}
                  </pre>
                </div>
              </div>

              {/* Détails Techniques */}
              {analysisDetails && (
                <div className="details-section">
                  <h4>{getText('metrics')}</h4>
                  <div className="details-grid">
                    {analysisDetails.confidence && (
                      <div className="detail-card">
                        <span className="detail-label">{getText('confidence')}</span>
                        <span className="detail-value">
                          {(analysisDetails.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {analysisDetails.dominant_colors && analysisDetails.dominant_colors.length > 0 && (
                      <div className="detail-card">
                        <span className="detail-label">{getText('colors')}</span>
                        <div className="color-palette">
                          {analysisDetails.dominant_colors.slice(0, 5).map((color, index) => (
                            <div
                              key={index}
                              className="color-swatch"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="detail-card">
                      <span className="detail-label">{getText('style')}</span>
                      <span className="detail-value">
                        {selectedLanguage === 'fr' ? 'Professionnel' : 
                         selectedLanguage === 'ar' ? 'احترافي' : 'Professional'}
                      </span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">{getText('mood')}</span>
                      <span className="detail-value">
                        {selectedLanguage === 'fr' ? 'Neutre' : 
                         selectedLanguage === 'ar' ? 'محايد' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="actions-section">
                <button
                  onClick={resetAnalysis}
                  className="reset-btn"
                >
                  <span>🔄</span>
                  {getText('newAnalysis')}
                </button>
              </div>
            </div>
          )}

          {/* Guide d'Utilisation */}
          <div className="info-section">
            <h4>{getText('guide')}</h4>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">🖼️</span>
                <h5>{getText('quality')}</h5>
                <p>{getText('qualityDesc')}</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🎨</span>
                <h5>{getText('content')}</h5>
                <p>{getText('contentDesc')}</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">⚡</span>
                <h5>{getText('performance')}</h5>
                <p>{getText('performanceDesc')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImageDescriptionGenerator;
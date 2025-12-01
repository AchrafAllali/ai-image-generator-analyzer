import React, { useState } from 'react';
import './MultiAIImageGenerator.css';

const MultiAIImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageType, setImageType] = useState('logo');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // NOUVEAU

  // Langues supportées
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  // Exemples multilingues
  const examples = {
    logo: {
      fr: "Logo moderne et épuré pour une marque de café premium",
      ar: "شعار حديث وأنيق لعلامة تجارية للقهوة الفاخرة",
      en: "Modern and sleek logo for a premium coffee brand"
    },
    character: {
      fr: "Personnage de bande dessinée réaliste, un aventurier dans la jungle",
      ar: "شخصية كرتونية واقعية، مغامر في الغابة",
      en: "Realistic cartoon character, an adventurer in the jungle"
    },
    scene: {
      fr: "Paysage urbain futuriste au coucher du soleil, architecture cyberpunk",
      ar: "مشهد حضري مستقبلي عند غروب الشمس، عمارة سايبربانك",
      en: "Futuristic urban landscape at sunset, cyberpunk architecture"
    },
    design: {
      fr: "Motif géométrique complexe inspiré de l'art islamique, couleurs bleu et or",
      ar: "نمط هندسي معقد مستوحى من الفن الإسلامي، ألوان أزرق وذهبي",
      en: "Complex geometric pattern inspired by Islamic art, blue and gold colors"
    }
  };

  const typeIcons = {
    logo: '🎯',
    character: '👨‍🎨',
    scene: '🏙️',
    design: '✨'
  };

  const typeLabels = {
    logo: {
      fr: 'Logo',
      ar: 'شعار',
      en: 'Logo'
    },
    character: {
      fr: 'Personnage',
      ar: 'شخصية',
      en: 'Character'
    },
    scene: {
      fr: 'Scène',
      ar: 'مشهد',
      en: 'Scene'
    },
    design: {
      fr: 'Design',
      ar: 'تصميم',
      en: 'Design'
    }
  };

  const typeDescriptions = {
    logo: {
      fr: 'Designs de marque et identité visuelle',
      ar: 'تصاميم العلامات التجارية والهوية البصرية',
      en: 'Brand designs and visual identity'
    },
    character: {
      fr: 'Personnages et créatures uniques',
      ar: 'شخصيات ومخلوقات فريدة',
      en: 'Unique characters and creatures'
    },
    scene: {
      fr: 'Paysages et environnements immersifs',
      ar: 'مناظر طبيعية وبيئات غامرة',
      en: 'Immersive landscapes and environments'
    },
    design: {
      fr: 'Motifs et compositions artistiques',
      ar: 'أنماط وتركيبات فنية',
      en: 'Artistic patterns and compositions'
    }
  };

  // Textes de l'interface multilingues
  const getText = (key) => {
    const texts = {
      title: {
        fr: "Générateur d'Images IA Pro",
        ar: "مولد الصور بالذكاء الاصطناعي المحترف",
        en: "AI Image Generator Pro"
      },
      subtitle: {
        fr: "Technologie IA avancée • Génération multi-moteurs • Résultats professionnels",
        ar: "تقنية ذكاء اصطناعي متقدمة • توليد متعدد المحركات • نتائج احترافية",
        en: "Advanced AI Technology • Multi-engine Generation • Professional Results"
      },
      typeCreation: {
        fr: "Type de Création",
        ar: "نوع الإنشاء",
        en: "Creation Type"
      },
      imageDescription: {
        fr: "Description de Votre Image",
        ar: "وصف صورتك",
        en: "Your Image Description"
      },
      useExample: {
        fr: "Utiliser l'Exemple",
        ar: "استخدام المثال",
        en: "Use Example"
      },
      placeholder: {
        fr: "Décrivez en détail l'image que vous souhaitez créer...",
        ar: "صف بالتفصيل الصورة التي تريد إنشاءها...",
        en: "Describe in detail the image you want to create..."
      },
      charCount: {
        fr: "caractères",
        ar: "حرف",
        en: "characters"
      },
      tooShort: {
        fr: "❌ Trop court",
        ar: "❌ قصير جداً",
        en: "❌ Too short"
      },
      canBeDetailed: {
        fr: "⚠️ Peut être plus détaillé",
        ar: "⚠️ يمكن أن يكون أكثر تفصيلاً",
        en: "⚠️ Can be more detailed"
      },
      optimal: {
        fr: "✅ Description optimale",
        ar: "✅ وصف مثالي",
        en: "✅ Optimal description"
      },
      generating: {
        fr: "Générer avec l'IA Avancée",
        ar: "إنشاء بالذكاء الاصطناعي المتقدم",
        en: "Generate with Advanced AI"
      },
      optimizing: {
        fr: "Optimisation IA en cours...",
        ar: "جاري التحسين بالذكاء الاصطناعي...",
        en: "AI optimization in progress..."
      },
      generatingMulti: {
        fr: "Génération multi-moteurs...",
        ar: "التوليد متعدد المحركات...",
        en: "Multi-engine generation..."
      },
      promptOptimized: {
        fr: "Prompt Optimisé par l'IA",
        ar: "وصف محسّن بالذكاء الاصطناعي",
        en: "AI-Optimized Prompt"
      },
      optimizedFor: {
        fr: "Optimisé pour",
        ar: "محسّن لـ",
        en: "Optimized for"
      },
      resultsTitle: {
        fr: "🎨 Résultats de la Génération Multi-Moteurs",
        ar: "🎨 نتائج التوليد متعدد المحركات",
        en: "🎨 Multi-Engine Generation Results"
      },
      model: {
        fr: "Modèle",
        ar: "نموذج",
        en: "Model"
      },
      download: {
        fr: "⬇️ Télécharger",
        ar: "⬇️ تحميل",
        en: "⬇️ Download"
      },
      imageSelected: {
        fr: "Image sélectionnée",
        ar: "الصورة المختارة",
        en: "Selected Image"
      },
      quality: {
        fr: "Qualité",
        ar: "جودة",
        en: "Quality"
      },
      readyDownload: {
        fr: "Prêt au téléchargement",
        ar: "جاهز للتحميل",
        en: "Ready to download"
      },
      downloadSelected: {
        fr: "⬇️ Télécharger l'Image Sélectionnée",
        ar: "⬇️ تحميل الصورة المختارة",
        en: "⬇️ Download Selected Image"
      },
      newVariations: {
        fr: "🔄 Générer de Nouvelles Variations",
        ar: "🔄 إنشاء تنويعات جديدة",
        en: "🔄 Generate New Variations"
      },
      guideTitle: {
        fr: "🚀 Guide d'Utilisation Professionnel",
        ar: "🚀 دليل الاستخدام الاحترافي",
        en: "🚀 Professional Usage Guide"
      },
      phase1Title: {
        fr: "Phase 1 - Optimisation IA:",
        ar: "المرحلة 1 - التحسين بالذكاء الاصطناعي:",
        en: "Phase 1 - AI Optimization:"
      },
      phase1Desc: {
        fr: "Notre intelligence artificielle analyse et améliore votre description pour des résultats optimaux.",
        ar: "يقوم ذكاؤنا الاصطناعي بتحليل وتحسين وصفك للحصول على نتائج مثالية.",
        en: "Our artificial intelligence analyzes and improves your description for optimal results."
      },
      phase2Title: {
        fr: "Phase 2 - Génération Multi-Moteurs:",
        ar: "المرحلة 2 - التوليد متعدد المحركات:",
        en: "Phase 2 - Multi-Engine Generation:"
      },
      phase2Desc: {
        fr: "Trois moteurs IA spécialisés génèrent simultanément vos images avec des approches différentes.",
        ar: "ثلاثة محركات ذكاء اصطناعي متخصصة تولد صورك في وقت واحد بأساليب مختلفة.",
        en: "Three specialized AI engines simultaneously generate your images with different approaches."
      },
      phase3Title: {
        fr: "Phase 3 - Sélection & Téléchargement:",
        ar: "المرحلة 3 - الاختيار والتحميل:",
        en: "Phase 3 - Selection & Download:"
      },
      phase3Desc: {
        fr: "Comparez les résultats et téléchargez l'image qui correspond le mieux à vos besoins.",
        ar: "قارن النتائج وقم بتنزيل الصورة التي تناسب احتياجاتك بشكل أفضل.",
        en: "Compare results and download the image that best suits your needs."
      },
      phase4Title: {
        fr: "Fonctionnalités Avancées:",
        ar: "الميزات المتقدمة:",
        en: "Advanced Features:"
      },
      phase4Desc: {
        fr: "Régénérez avec de nouveaux paramètres, téléchargez en haute résolution, exportez pour vos projets.",
        ar: "أعد التوليد بمعاملات جديدة، قم بالتنزيل بدقة عالية، قم بالتصدير لمشاريعك.",
        en: "Regenerate with new parameters, download in high resolution, export for your projects."
      },
      proTipsTitle: {
        fr: "💡 Conseils Professionnels:",
        ar: "💡 نصائح احترافية:",
        en: "💡 Professional Tips:"
      },
      tip1Title: {
        fr: "Soyez Spécifique",
        ar: "كن محدداً",
        en: "Be Specific"
      },
      tip1Desc: {
        fr: "Décrivez les couleurs, styles, ambiances et éléments importants",
        ar: "صف الألوان والأنماط والأجواء والعناصر المهمة",
        en: "Describe colors, styles, moods and important elements"
      },
      tip2Title: {
        fr: "Utilisez des Références",
        ar: "استخدم المراجع",
        en: "Use References"
      },
      tip2Desc: {
        fr: "Mentionnez des styles artistiques ou des influences connues",
        ar: "اذكر الأنماط الفنية أو التأثيرات المعروفة",
        en: "Mention artistic styles or known influences"
      },
      tip3Title: {
        fr: "Testez Plusieurs Versions",
        ar: "جرب عدة إصدارات",
        en: "Test Multiple Versions"
      },
      tip3Desc: {
        fr: "La régénération avec différents seeds donne des résultats variés",
        ar: "يعطي التجديد ببذور مختلفة نتائج متنوعة",
        en: "Regeneration with different seeds gives varied results"
      },
      // Descriptions des moteurs
      engineStandard: {
        fr: "Moteur Standard",
        ar: "المحرك القياسي",
        en: "Standard Engine"
      },
      engineStandardDesc: {
        fr: "Équilibre qualité et rapidité",
        ar: "توازن الجودة والسرعة",
        en: "Quality and speed balance"
      },
      engineAdvanced: {
        fr: "Moteur Avancé",
        ar: "المحرك المتقدم",
        en: "Advanced Engine"
      },
      engineAdvancedDesc: {
        fr: "Qualité supérieure, plus de détails",
        ar: "جودة فائقة، المزيد من التفاصيل",
        en: "Superior quality, more details"
      },
      engineArtistic: {
        fr: "Moteur Artistique",
        ar: "المحرك الفني",
        en: "Artistic Engine"
      },
      engineArtisticDesc: {
        fr: "Style créatif et unique",
        ar: "أسلوب إبداعي وفريد",
        en: "Creative and unique style"
      }
    };

    return texts[key]?.[selectedLanguage] || key;
  };

  // Amélioration du prompt avec Claude API
  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      setError(selectedLanguage === 'fr' ? 'Veuillez saisir une description pour votre image' :
              selectedLanguage === 'ar' ? 'يرجى إدخال وصف للصورة' :
              'Please enter a description for your image');
      return;
    }

    if (prompt.length > 500) {
      setError(selectedLanguage === 'fr' ? 'La description ne peut pas dépasser 500 caractères' :
              selectedLanguage === 'ar' ? 'لا يمكن أن يتجاوز الوصف 500 حرف' :
              'Description cannot exceed 500 characters');
      return;
    }

    setIsEnhancing(true);
    setError('');
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_CLAUDE_API_KEY,
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `As an expert in creating AI prompts, transform this simple description into a detailed and professional prompt in English, optimized for AI image generation.

Image Type: ${imageType}
User Description: ${prompt}

Requirements:
- Maximum 100 words
- Be specific about style, colors, lighting, composition
- Use professional artistic terminology
- Focus on visual details
- Output ONLY the enhanced prompt, without explanations or quotes

Enhanced Prompt:`
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const enhanced = data.content[0].text.trim();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setEnhancedPrompt(enhanced);
        setIsEnhancing(false);
        setProgress(0);
        generateImages(enhanced);
      }, 500);

    } catch (err) {
      const errorMsg = selectedLanguage === 'fr' ? 'Impossible d\'améliorer le texte. Utilisation de la version originale.' :
                       selectedLanguage === 'ar' ? 'تعذر تحسين النص. استخدام النسخة الأصلية.' :
                       'Unable to improve text. Using original version.';
      setError(errorMsg);
      console.error('Enhancement error:', err);
      setIsEnhancing(false);
      setProgress(0);
      generateImages(prompt);
    }
  };

  // Génération depuis différentes sources
  const generateImages = async (finalPrompt) => {
    setIsGenerating(true);
    setImages([]);
    setSelectedImage(null);
    setError('');

    const seed = Date.now();
    
    const typeConfigs = {
      logo: {
        prefix: 'professional logo design, modern, clean, ',
        styles: ['minimalist', 'vector', 'professional branding']
      },
      character: {
        prefix: 'character illustration, detailed, ',
        styles: ['concept art', 'digital painting', 'character design sheet']
      },
      scene: {
        prefix: 'photorealistic scene, cinematic, ',
        styles: ['epic landscape', 'atmospheric lighting', 'high detail']
      },
      design: {
        prefix: 'artistic design, intricate, ',
        styles: ['geometric pattern', 'ornamental', 'abstract art']
      }
    };

    const config = typeConfigs[imageType] || { prefix: '', styles: [] };

    const sources = [
      {
        name: getText('engineStandard'),
        description: getText('engineStandardDesc'),
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(config.prefix + finalPrompt)}?width=512&height=512&seed=${seed}&enhance=true`,
        color: '#667eea',
        model: 'default'
      },
      {
        name: getText('engineAdvanced'),
        description: getText('engineAdvancedDesc'),
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(config.prefix + finalPrompt + ', ' + config.styles[0] + ', high quality, 4k, detailed')}?width=512&height=512&seed=${seed + 1}&model=flux`,
        color: '#764ba2',
        model: 'flux'
      },
      {
        name: getText('engineArtistic'),
        description: getText('engineArtisticDesc'),
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(config.prefix + finalPrompt + ', ' + config.styles[1] + ', artistic style, vibrant colors, creative')}?width=512&height=512&seed=${seed + 2}&nologo=true`,
        color: '#f093fb',
        model: 'creative'
      }
    ];

    const generatedImages = [];
    
    for (let i = 0; i < sources.length; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 + i * 500));
        
        const imageUrl = sources[i].url;
        generatedImages.push({
          ...sources[i],
          status: 'loaded',
          id: i,
          url: imageUrl,
          timestamp: new Date().toLocaleTimeString()
        });
        
        setImages([...generatedImages]);
        
      } catch (err) {
        console.error(`Image generation error ${i}:`, err);
        generatedImages.push({
          ...sources[i],
          status: 'error',
          id: i,
          url: '',
          error: 'Generation failed'
        });
      }
    }

    setIsGenerating(false);
  };

  const downloadImage = async (imageUrl, imageName) => {
    if (!imageUrl) {
      setError(selectedLanguage === 'fr' ? 'URL d\'image invalide' :
              selectedLanguage === 'ar' ? 'رابط الصورة غير صالح' :
              'Invalid image URL');
      return;
    }

    try {
      setError('');
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error('Download error');
      }
      
      const blob = await response.blob();
      
      if (blob.size < 1000) {
        throw new Error('Image corrupted or too small');
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}-${Date.now()}.png`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      const errorMsg = selectedLanguage === 'fr' ? 'Échec du téléchargement de l\'image. Veuillez réessayer.' :
                       selectedLanguage === 'ar' ? 'فشل تنزيل الصورة. يرجى المحاولة مرة أخرى.' :
                       'Image download failed. Please try again.';
      setError(errorMsg);
      console.error('Download error:', err);
    }
  };

  const downloadSelected = () => {
    if (selectedImage) {
      downloadImage(selectedImage.url, selectedImage.name);
    } else {
      const errorMsg = selectedLanguage === 'fr' ? 'Veuillez sélectionner une image à télécharger' :
                       selectedLanguage === 'ar' ? 'يرجى اختيار صورة للتحميل' :
                       'Please select an image to download';
      setError(errorMsg);
    }
  };

  const regenerateImages = () => {
    if (enhancedPrompt || prompt) {
      generateImages(enhancedPrompt || prompt);
    }
  };

  return (
    <div className="multi-ai-container">
      <div className="multi-ai-wrapper">
        
        {/* En-tête Professionnel */}
        <div className="multi-ai-header">
          <div className="header-content">
            <span className="header-icon">✨</span>
            <h1>{getText('title')}</h1>
          </div>
          <p className="header-subtitle">
            {getText('subtitle')}
          </p>

          {/* Sélecteur de langue */}
          <div className="language-selector" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`lang-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.75rem',
                  background: selectedLanguage === lang.code ? 
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                    'rgba(255, 255, 255, 0.05)',
                  border: selectedLanguage === lang.code ? 
                    'none' : 
                    '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50px',
                  color: 'var(--text-light)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: selectedLanguage === lang.code ? 
                    '0 10px 30px rgba(102, 126, 234, 0.5)' : 
                    'none'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="multi-ai-content">
          
          {/* Sélection du Type d'Image */}
          <div className="section">
            <h3 className="section-title">{getText('typeCreation')}</h3>
            <div className="type-grid">
              {Object.keys(examples).map(type => (
                <button
                  key={type}
                  onClick={() => setImageType(type)}
                  className={`type-card ${imageType === type ? 'active' : ''}`}
                >
                  <span className="type-icon">{typeIcons[type]}</span>
                  <div className="type-text">
                    <span className="type-label">{typeLabels[type][selectedLanguage]}</span>
                    <span className="type-description">{typeDescriptions[type][selectedLanguage]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Saisie du Prompt */}
          <div className="section">
            <div className="input-header">
              <h3 className="section-title">{getText('imageDescription')}</h3>
              <button
                onClick={() => {
                  setPrompt(examples[imageType][selectedLanguage]);
                  setError('');
                }}
                className="example-btn"
                type="button"
              >
                <span>💡</span>
                {getText('useExample')}
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError('');
              }}
              placeholder={`${getText('placeholder')} ${examples[imageType][selectedLanguage]}`}
              className="prompt-textarea"
              rows="4"
              maxLength="500"
              dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
            <div className="char-counter">
              {prompt.length} / 500 {getText('charCount')} • 
              {prompt.length < 50 ? ` ${getText('tooShort')}` : 
               prompt.length < 150 ? ` ${getText('canBeDetailed')}` : 
               ` ${getText('optimal')}`}
            </div>
          </div>

          {/* Bouton de Génération */}
          <div className="section">
            <button
              onClick={enhancePrompt}
              disabled={isEnhancing || isGenerating || !prompt.trim()}
              className="generate-btn"
              type="button"
            >
              {isEnhancing ? (
                <>
                  <span className="spinner"></span>
                  {getText('optimizing')} {progress}%
                </>
              ) : isGenerating ? (
                <>
                  <span className="spinner"></span>
                  {getText('generatingMulti')}
                </>
              ) : (
                <>
                  <span className="wand-icon">🪄</span>
                  {getText('generating')}
                </>
              )}
            </button>
            
            {isEnhancing && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Affichage du Prompt Optimisé */}
          {enhancedPrompt && (
            <div className="enhanced-box">
              <div className="enhanced-header">
                <span className="check-icon">✓</span>
                <h4>{getText('promptOptimized')}</h4>
              </div>
              <p className="enhanced-text">{enhancedPrompt}</p>
              <div className="enhanced-info">
                <small>✅ {getText('optimizedFor')} {typeLabels[imageType][selectedLanguage]}</small>
              </div>
            </div>
          )}

          {/* Messages d'Erreur */}
          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <div>
                <p><strong>{selectedLanguage === 'ar' ? 'تحذير' : selectedLanguage === 'fr' ? 'Attention' : 'Warning'}:</strong> {error}</p>
              </div>
            </div>
          )}

          {/* Galerie des Résultats */}
          {images.length > 0 && (
            <div className="results-section">
              <h3 className="results-title">
                {getText('resultsTitle')}
              </h3>
              
              <div className="images-grid">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`image-card ${selectedImage?.id === img.id ? 'selected' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <div 
                      className="color-bar"
                      style={{ backgroundColor: img.color }}
                    />
                    <div className="card-content">
                      <div className="card-header">
                        <div>
                          <h4 className="card-title">{img.name}</h4>
                          <p className="card-description">{img.description}</p>
                          <small className="model-info">{getText('model')}: {img.model} • {img.timestamp}</small>
                        </div>
                        {selectedImage?.id === img.id && (
                          <span className="selected-badge">✓</span>
                        )}
                      </div>
                      
                      <div className="image-wrapper">
                        {img.status === 'loaded' ? (
                          <img
                            src={img.url}
                            alt={`Generated by ${img.name}`}
                            className="generated-img"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="image-error">
                            ❌ {selectedLanguage === 'fr' ? 'Échec de chargement' :
                                selectedLanguage === 'ar' ? 'فشل التحميل' :
                                'Loading failed'}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(img.url, img.name);
                        }}
                        className="download-btn-small"
                        disabled={img.status !== 'loaded'}
                      >
                        {getText('download')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions sur la Sélection */}
              {selectedImage && (
                <div className="selected-box">
                  <p className="selected-text">
                    <strong>{getText('imageSelected')}:</strong> {selectedImage.name} 
                    <br />
                    <small>{getText('quality')} {selectedImage.model} • {getText('readyDownload')}</small>
                  </p>
                  <button
                    onClick={downloadSelected}
                    className="download-btn-large"
                  >
                    {getText('downloadSelected')}
                  </button>
                </div>
              )}

              {/* Régénération */}
              <button
                onClick={regenerateImages}
                className="regenerate-btn"
                disabled={isGenerating}
              >
                {getText('newVariations')}
              </button>
            </div>
          )}

          {/* Guide d'Utilisation */}
          <div className="info-box">
            <h4 className="info-title">{getText('guideTitle')}</h4>
            <ul className="info-list">
              <li>
                <span>🤖</span>
                <div>
                  <strong>{getText('phase1Title')}</strong> {getText('phase1Desc')}
                </div>
              </li>
              <li>
                <span>🎨</span>
                <div>
                  <strong>{getText('phase2Title')}</strong> {getText('phase2Desc')}
                </div>
              </li>
              <li>
                <span>⭐</span>
                <div>
                  <strong>{getText('phase3Title')}</strong> {getText('phase3Desc')}
                </div>
              </li>
              <li>
                <span>🔄</span>
                <div>
                  <strong>{getText('phase4Title')}</strong> {getText('phase4Desc')}
                </div>
              </li>
            </ul>
            
            <div className="pro-tips">
              <h5>{getText('proTipsTitle')}</h5>
              <div className="tips-grid">
                <div className="tip-card">
                  <strong>{getText('tip1Title')}</strong>
                  <p>{getText('tip1Desc')}</p>
                </div>
                <div className="tip-card">
                  <strong>{getText('tip2Title')}</strong>
                  <p>{getText('tip2Desc')}</p>
                </div>
                <div className="tip-card">
                  <strong>{getText('tip3Title')}</strong>
                  <p>{getText('tip3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MultiAIImageGenerator;
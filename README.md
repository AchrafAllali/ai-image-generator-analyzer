# 🎨 AI Image Generator & Analyzer

Une application web professionnelle complète qui combine la génération d'images par IA et l'analyse intelligente d'images, avec support multilingue (Français, Arabe, Anglais).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités Principales

### 🎨 Générateur d'Images IA
- **Multi-moteurs IA** : Génération simultanée avec 3 moteurs différents
- **Optimisation intelligente** : Amélioration automatique des prompts via Claude API
- **Types d'images** : Logo, Personnage, Scène, Design
- **Support multilingue** : Interface en Français, Arabe et Anglais
- **Téléchargement facile** : Export des images en haute résolution 

### 🔍 Analyseur d'Images IA
- **Analyse approfondie** : Description détaillée du contenu visuel
- **Multi-modèles** : Utilisation de BLIP et ViT pour analyse précise
- **Traduction IA** : Rapports en 3 langues (FR, AR, EN)
- **Métriques détaillées** : Couleurs dominantes, résolution, composition
- **Export de rapports** : Copie en un clic des analyses

## 🚀 Technologies Utilisées

### Frontend
- **React** 18.2.0 - Framework JavaScript moderne
- **CSS3** - Animations et design responsive
- **Claude API** - Optimisation des prompts IA

### Backend (Python)
- **Flask** 2.3.3 - Framework web Python
- **Transformers** 4.30.0 - Modèles IA (BLIP, ViT)
- **PyTorch** 2.0.0 - Deep Learning
- **Pillow** 10.0.0 - Traitement d'images

## 📦 Installation

### Prérequis
- Node.js 16+ et npm
- Python 3.8+
- Clé API Anthropic Claude

### Installation Frontend

```bash
# Cloner le repository
git clone https://github.com/votre-username/ai-image-generator.git
cd ai-image-generator

# Installer les dépendances
npm install

# Créer le fichier .env
echo "REACT_APP_CLAUDE_API_KEY=votre_clé_api" > .env

# Démarrer l'application
npm start
```

### Installation Backend

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur
python server-final.py
```

## 🎯 Utilisation

### Générateur d'Images

1. **Sélectionner la langue** : Choisir entre Français, Arabe ou Anglais
2. **Choisir le type** : Logo, Personnage, Scène ou Design
3. **Décrire l'image** : Entrer une description détaillée
4. **Générer** : L'IA optimise le prompt et génère 3 variations
5. **Télécharger** : Sélectionner et télécharger l'image préférée

### Analyseur d'Images

1. **Sélectionner la langue** : FR, AR ou EN
2. **Importer une image** : Glisser-déposer ou cliquer pour parcourir
3. **Analyser** : L'IA génère un rapport détaillé
4. **Consulter** : Voir les métriques et descriptions
5. **Copier** : Exporter le rapport en un clic

## 📁 Structure du Projet

```
ai-image-generator/
├── backend/
│   ├── server-final.py          # Serveur Flask principal
│   └── requirements.txt         # Dépendances Python
├── public/
│   ├── index.html              # Page HTML principale
│   ├── favicon.ico             # Icône du site
│   └── manifest.json           # Configuration PWA
├── src/
│   ├── components/
│   │   ├── MultiAIImageGenerator.js
│   │   ├── MultiAIImageGenerator.css
│   │   ├── ImageDescriptionGenerator.js
│   │   └── ImageDescriptionGenerator.css
│   ├── App.js                  # Composant principal
│   ├── App.css                 # Styles globaux
│   ├── index.js                # Point d'entrée React
│   └── index.css               # Styles de base
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Captures d'Écran

### Générateur d'Images


<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/cff5a583-bfb2-46c4-9202-de12c7b755b7" />

<img width="1920" height="973" alt="image" src="https://github.com/user-attachments/assets/d3643075-af7e-496b-8160-a90a8aa1fd5c" />

<img width="1920" height="975" alt="image" src="https://github.com/user-attachments/assets/a898c419-56ca-4f9f-9b79-af2e64d0b910" />


### Analyseur d'Images



<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/3fd62f55-d6e3-4b8d-8404-6d2f14feff0f" />

<img width="1920" height="967" alt="image" src="https://github.com/user-attachments/assets/49190085-8549-40a0-ab63-ea9e70354e35" />
<img width="1920" height="968" alt="image" src="https://github.com/user-attachments/assets/1a9e0da4-4e87-48af-af88-e27032fbea5f" />

## ⚙️ Configuration

### Variables d'Environnement

```env
# Frontend (.env)
REACT_APP_CLAUDE_API_KEY=your_claude_api_key_here
```

### Configuration Backend

Le serveur backend démarre sur `http://localhost:8000` par défaut. Les modèles IA se chargent automatiquement au démarrage.

## 🔧 Développement

### Commandes Utiles

```bash
# Frontend
npm start              # Démarrer en développement
npm test              # Lancer les tests
npm run build         # Build de production
npm run eject         # Éjecter la configuration

# Backend
python server-final.py # Démarrer le serveur
```

### Tests

```bash
# Lancer les tests React
npm test

# Avec couverture
npm test -- --coverage
```

## 🌍 Support Multilingue

L'application supporte nativement :
- 🇫🇷 **Français** - Interface complète
- 🇸🇦 **Arabe** - Support RTL intégré
- 🇺🇸 **Anglais** - Langue par défaut

## 📝 API Endpoints

### Backend Python

```
POST /api/analyze-image
- Description: Analyse une image uploadée
- Body: FormData (image, language)
- Response: { success, description, details }

GET /api/health
- Description: Vérifier l'état du serveur
- Response: { status, models_loaded, timestamp }

POST /api/test-translation
- Description: Tester la traduction IA
- Body: { text, language }
- Response: { success, original, translated }
```

## 🛠️ Technologies d'IA Utilisées

### Modèles de Vision
- **BLIP** (Salesforce) - Génération de descriptions
- **ViT** (Google) - Classification d'images
- **Helsinki-NLP** - Traduction multilingue

### APIs Externes
- **Claude API** (Anthropic) - Optimisation de prompts
- **Pollinations AI** - Génération d'images

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

```bash
# Build de production
npm run build

# Déployer sur Vercel
vercel --prod

# Ou sur Netlify
netlify deploy --prod
```

### Backend (Heroku/Railway)

```bash
# Créer un Procfile
echo "web: python server-final.py" > Procfile

# Déployer
git push heroku main
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Achraf Allali** - *Développement initial* - [VotreGitHub](https://github.com/AchrafAllali)

## ❤️ Remerciements

- Anthropic pour l'API Claude
- Salesforce pour le modèle BLIP
- Google pour le modèle ViT
- La communauté Pollinations AI
- Tous les contributeurs open-source

## 📞 Contact

- **Email** : achrafallali2003@gmail.com
- **LinkedIn** : [Linkden](https://www.linkedin.com/in/achraf-allali-9889a0321/)

## 🐛 Bugs Connus & Roadmap

### Bugs Connus
- [ ] Chargement lent des modèles IA au premier démarrage
- [ ] Timeout possible sur images très volumineuses

### Roadmap
- [ ] Support de plus de formats d'images
- [ ] Ajout de styles de génération personnalisés
- [ ] Mode hors-ligne pour l'analyseur
- [ ] API publique documentée
- [ ] Application mobile (React Native)

## 💡 Support

Si vous rencontrez des problèmes :

1. Vérifier les [Issues](https://github.com/AchrafAllali/ai-image-generator-analyzer/issues) existantes
2. Créer une nouvelle issue avec le template approprié
3. Consulter la [Documentation](https://github.com/AchrafAllali/ai-image-generator-analyzer/wiki)

---

<p align="center">
  Fait avec ❤️ et ☕ par Achraf Allali
</p>

<p align="center">
  <a href="#top">⬆️ Retour en haut</a>
</p>

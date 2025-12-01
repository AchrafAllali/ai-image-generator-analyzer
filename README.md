# 🖼️ AI Image Analyzer - Analyse d'Images Multilingue

Un système d'analyse d'images intelligent utilisant l'IA pour générer des rapports détaillés en français, arabe et anglais.

## ✨ Fonctionnalités

- **Analyse d'images** avec modèles IA (BLIP + ViT)
- **Traduction multilingue** (Français, Arabe, Anglais)
- **Analyse technique** des couleurs et composition
- **Interface web** intuitive
- **API RESTful** pour intégration

## 📁 Structure du projet

```
ai-image-generator/
├── backend/           # Serveur API Flask
├── frontend/         # Interface utilisateur
└── README.md         # Documentation
```

## 🚀 Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
python server-final.py
```

### Frontend
Ouvrez simplement `frontend/index.html` dans votre navigateur.

## 🔗 Endpoints API

- `POST /api/analyze-image` - Analyser une image
- `GET /api/health` - Vérifier l'état du serveur
- `POST /api/test-translation` - Tester la traduction

## 🌍 Langues supportées

| Langue | Code |
|--------|------|
| Français | `fr` |
| Arabe | `ar` |
| Anglais | `en` |


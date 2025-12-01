import React, { useState } from 'react';
import './App.css';
import MultiAIImageGenerator from './components/MultiAIImageGenerator';
import ImageDescriptionGenerator from './components/ImageDescriptionGenerator';

function App() {
  const [currentMode, setCurrentMode] = useState('generate'); // 'generate' ou 'describe'

  return (
    <div className="App">
      {/* Sélecteur de mode */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${currentMode === 'generate' ? 'active' : ''}`}
          onClick={() => setCurrentMode('generate')}
        >
          🎨 Générer des Images
        </button>
        <button 
          className={`mode-btn ${currentMode === 'describe' ? 'active' : ''}`}
          onClick={() => setCurrentMode('describe')}
        >
          🔍 Analyser des Images
        </button>
      </div>

      {/* Composant actif */}
      {currentMode === 'generate' ? <MultiAIImageGenerator /> : <ImageDescriptionGenerator />}
    </div>
  );
}

export default App;
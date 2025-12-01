import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configuration de développement (optionnelle)
if (process.env.NODE_ENV === 'development') {
  // Vous pouvez ajouter d'autres outils de dev ici
  console.log('Mode développement activé');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Composant Error Boundary pour attraper les erreurs globales
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur React capturée:', error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
    
    // En production, vous pouvez envoyer à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Exemple: envoyer à Sentry, LogRocket, etc.
      // this.logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>🚨 Erreur Inattendue</h1>
            <p style={{ marginBottom: '20px', opacity: 0.9 }}>
              Une erreur s'est produite dans l'application. Veuillez actualiser la page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Actualiser la Page
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '30px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                  Détails techniques (Développement)
                </summary>
                <div style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  padding: '15px', 
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  <strong>Erreur:</strong>
                  <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
                    {this.state.error && this.state.error.toString()}
                  </pre>
                  <strong>Stack:</strong>
                  <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Report web vitals
reportWebVitals();
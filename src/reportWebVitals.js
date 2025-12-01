const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Core Web Vitals
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
      
      // Métriques supplémentaires pour le monitoring
      const observePerfMetrics = () => {
        // First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (onPerfEntry) {
              onPerfEntry({
                name: 'FCP',
                value: entry.startTime,
                rating: entry.startTime < 1000 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor'
              });
            }
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (onPerfEntry) {
              onPerfEntry({
                name: 'LCP',
                value: entry.startTime,
                rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor'
              });
            }
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        let clsEntries = [];

        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsEntries.push(entry);
              clsValue += entry.value;
              
              if (onPerfEntry) {
                onPerfEntry({
                  name: 'CLS',
                  value: clsValue,
                  rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
                });
              }
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      };

      // Démarrer l'observation après le chargement
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observePerfMetrics);
      } else {
        observePerfMetrics();
      }
    }).catch((error) => {
      console.error('Erreur lors du chargement de web-vitals:', error);
    });
  }
};

// Fonction utilitaire pour envoyer les métriques à Google Analytics
export const sendToGoogleAnalytics = ({ name, delta, value, id }) => {
  // Vérifier si gtag est disponible
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      non_interaction: true,
    });
  }
};

// Fonction pour envoyer à un endpoint personnalisé
export const sendToAnalytics = (metric) => {
  const body = JSON.stringify(metric);
  const url = '/api/analytics'; // Votre endpoint d'analytics

  // Utiliser navigator.sendBeacon si disponible, sinon fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
};

export default reportWebVitals;
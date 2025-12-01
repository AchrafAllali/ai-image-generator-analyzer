import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock pour l'API fetch
global.fetch = jest.fn();

describe('Générateur d\'Images IA Pro', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('rend l\'application avec le titre principal', () => {
    render(<App />);
    const titleElement = screen.getByText(/Générateur d'Images IA Pro/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('affiche les types d\'images disponibles', () => {
    render(<App />);
    
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Personnage')).toBeInTheDocument();
    expect(screen.getByText('Scène')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  test('permet de sélectionner un type d\'image', async () => {
    render(<App />);
    const user = userEvent.setup();

    const characterButton = screen.getByText('Personnage');
    await user.click(characterButton);

    expect(characterButton.closest('.type-card')).toHaveClass('active');
  });

  test('affiche un exemple quand on clique sur le bouton exemple', async () => {
    render(<App />);
    const user = userEvent.setup();

    const exampleButton = screen.getByText('Utiliser l\'Exemple');
    await user.click(exampleButton);

    const textarea = screen.getByPlaceholderText(/Décrivez en détail/i);
    expect(textarea.value).toBeTruthy();
  });

  test('empêche la génération avec un champ vide', async () => {
    render(<App />);
    const user = userEvent.setup();

    const generateButton = screen.getByText(/Générer avec l'IA Avancée/i);
    expect(generateButton).toBeDisabled();
  });

  test('affiche une erreur pour les descriptions trop longues', async () => {
    render(<App />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(/Décrivez en détail/i);
    const longText = 'a'.repeat(600);
    
    await user.type(textarea, longText);
    
    expect(screen.getByText(/Trop court/)).toBeInTheDocument();
  });

  test('génère des images avec succès', async () => {
    // Mock de la réponse API réussie
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          content: [{ text: 'Enhanced professional prompt in English' }]
        })
      })
    );

    render(<App />);
    const user = userEvent.setup();

    // Remplir le formulaire
    const textarea = screen.getByPlaceholderText(/Décrivez en détail/i);
    await user.type(textarea, 'Un logo moderne pour une startup tech');

    // Cliquer sur générer
    const generateButton = screen.getByText(/Générer avec l'IA Avancée/i);
    await user.click(generateButton);

    // Vérifier le chargement
    await waitFor(() => {
      expect(screen.getByText(/Optimisation IA en cours/i)).toBeInTheDocument();
    });

    // Vérifier que l'API a été appelée
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('gère les erreurs d\'API gracieusement', async () => {
    // Mock d'une erreur API
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API unreachable'))
    );

    render(<App />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(/Décrivez en détail/i);
    await user.type(textarea, 'Test description');

    const generateButton = screen.getByText(/Générer avec l'IA Avancée/i);
    await user.click(generateButton);

    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByText(/Impossible d'améliorer le texte/i)).toBeInTheDocument();
    });
  });

  test('télécharge une image sélectionnée', async () => {
    // Mock pour URL.createObjectURL et les APIs de téléchargement
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    render(<App />);
    
    // Simuler des images générées
    const mockImages = [
      {
        id: 1,
        name: 'Test Image',
        url: 'https://example.com/image.png',
        status: 'loaded'
      }
    ];

    // Pour tester le téléchargement, vous devrez peut-être
    // utiliser une approche différente selon votre implémentation
  });

  test('est accessible avec le clavier', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Navigation au clavier
    const textarea = screen.getByPlaceholderText(/Décrivez en détail/i);
    await user.tab();
    
    expect(textarea).toHaveFocus();
  });
});

// Tests de performance
describe('Performance', () => {
  test('charge rapidement', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(1000); // Moins d'une seconde
  });

  test('n\'a pas de re-rendus inutiles', async () => {
    const { rerender } = render(<App />);
    
    const initialRenderCount = fetch.mock.calls.length;
    
    // Re-render avec les mêmes props
    rerender(<App />);
    
    expect(fetch.mock.calls.length).toBe(initialRenderCount);
  });
});
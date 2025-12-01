// jest-dom ajoute des matchers jest personnalisés pour asserting sur les nodes DOM.
// Permet de faire des choses comme :
// expect(element).toHaveTextContent(/react/i)
// Apprenez-en plus : https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Extensions pour les tests React
import { TextEncoder, TextDecoder } from 'util';

// Polyfills pour l'environnement de test
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock pour les APIs externes
global.fetch = jest.fn();

// Configuration globale pour les tests
beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Helpers pour les tests
global.createMockFile = (name, size, type) => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock pour les APIs de navigateur
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Déprécié
    removeListener: jest.fn(), // Déprécié
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock pour ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
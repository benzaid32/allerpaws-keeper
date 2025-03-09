
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prevent ethereum property error by creating a non-configurable property
// This stops third-party scripts from redefining the property
if (typeof window !== 'undefined') {
  if (!window.hasOwnProperty('ethereum')) {
    Object.defineProperty(window, 'ethereum', {
      value: undefined,
      writable: true,
      configurable: false
    });
  }
}

// Prevent multiple registration of service worker events
window.__allerpawsEventsRegistered = window.__allerpawsEventsRegistered || false;

// Mount the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(<App />);

// Log that the app has loaded
console.log('App loaded successfully');

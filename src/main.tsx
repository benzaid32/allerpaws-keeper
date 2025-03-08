
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

createRoot(document.getElementById("root")!).render(<App />);

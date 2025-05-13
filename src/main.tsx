
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add raga color palette to tailwind classes
// These will be accessible as from-raga-purple, to-raga-blue, etc.
document.documentElement.style.setProperty('--raga-purple', '#9b87f5');
document.documentElement.style.setProperty('--raga-blue', '#33C3F0');

createRoot(document.getElementById("root")!).render(<App />);

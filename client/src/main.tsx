// frontend/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';
import './styles/index.css';

// ONLY ADD THIS LINE:
console.log(`🚀 ${import.meta.env.VITE_APP_NAME || 'SmartClass'} - ${import.meta.env.PROD ? 'Production' : 'Development'}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
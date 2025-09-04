import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';
import React from 'react';

const loadingMarkup = (
  <div className="min-h-screen flex items-center justify-center">
    <h3>Loading...</h3>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <React.Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </React.Suspense>
);
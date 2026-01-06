import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Erro ao renderizar a aplicação:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: white; background: #0a0a0a; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: sans-serif;">
      <h1 style="color: #f59e0b; margin-bottom: 20px;">Erro ao carregar a aplicação</h1>
      <p style="color: #e5e5e5; margin-bottom: 10px;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      <p style="color: #666; font-size: 14px;">Verifique o console do navegador para mais detalhes.</p>
    </div>
  `;
}
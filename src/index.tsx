import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('🚀 React application starting...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

console.log('✅ Root element found');

const root = ReactDOM.createRoot(rootElement);

// Показываем загрузку сразу
root.render(
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
      <h1>Property Store</h1>
      <p>Загрузка приложения...</p>
    </div>
  </div>
);

// Динамический импорт App
import('./App')
  .then(({ default: App }) => {
    console.log('✅ App module loaded successfully');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ React app rendered');
  })
  .catch((error) => {
    console.error('❌ Failed to load App module:', error);
    
    // Fallback UI с ошибкой
    root.render(
      <div style={{
        padding: '2rem',
        background: '#dc3545',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>⚠️ Ошибка загрузки приложения</h1>
        <p>Не удалось загрузить основное приложение</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#dc3545',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Перезагрузить страницу
        </button>
        <details style={{ marginTop: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px' }}>
          <summary>Технические детали</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {error.message}
          </pre>
        </details>
      </div>
    );
  });
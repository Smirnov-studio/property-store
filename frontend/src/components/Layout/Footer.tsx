import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#f8f9fa',
      padding: '2rem 0',
      textAlign: 'center',
      borderTop: '1px solid #e9ecef',
      marginTop: 'auto'
    }}>
      <div className="container">
        <p style={{ margin: 0, color: '#6c757d' }}>
          &copy; 2024 Property Store. Все права защищены.
        </p>
        <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
          Версия приложения: 1.0.0 | API: http://localhost:3001/api
        </p>
      </div>
    </footer>
  );
};

export default Footer;
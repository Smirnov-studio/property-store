import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header" style={{
      background: 'var(--primary-color)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: 'var(--shadow)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              🏠 Property Store
            </Link>
            
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/catalog" style={{ color: 'white', textDecoration: 'none' }}>
                Каталог
              </Link>
              <Link to="/calculator" style={{ color: 'white', textDecoration: 'none' }}>
                Калькулятор
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                  Админ-панель
                </Link>
              )}
            </nav>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.isAuthenticated ? (
              <>
                <span style={{ fontSize: '0.9rem' }}>
                  Привет, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '0.5rem 1rem'
                }}>
                  Войти
                </Link>
                <Link to="/register" style={{ 
                  color: 'var(--primary-color)', 
                  background: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px'
                }}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
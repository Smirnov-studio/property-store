import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mock API call - in real app, this would be a real API request
      await onLogin(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    setEmail(type === 'admin' ? 'admin@example.com' : 'user@example.com');
    setPassword('password123');
    
    try {
      await onLogin(
        type === 'admin' ? 'admin@example.com' : 'user@example.com',
        'password123'
      );
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', padding: '4rem 0' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>
          Вход в систему
        </h1>
        
        {error && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            color: 'var(--danger-color)',
            padding: '1rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '1.5rem',
            border: '1px solid rgba(220, 53, 69, 0.2)'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
              style={{ width: '100%' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
              Зарегистрироваться
            </Link>
          </p>
          
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Для демонстрации используйте:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              Войти как пользователь
            </button>
            <button 
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              Войти как администратор
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
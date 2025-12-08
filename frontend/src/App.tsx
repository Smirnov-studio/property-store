import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

// Layout
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Mock user for demo (in real app, use context/Redux)
const mockUser = {
  id: 1,
  email: 'admin@example.com',
  name: 'Администратор',
  role: 'admin',
  isAuthenticated: true
};

const App: React.FC = () => {
  const [user, setUser] = React.useState(mockUser);

  const handleLogin = (email: string, password: string) => {
    // Mock login
    setUser({
      id: 1,
      email,
      name: email === 'admin@example.com' ? 'Администратор' : 'Пользователь',
      role: email === 'admin@example.com' ? 'admin' : 'user',
      isAuthenticated: true
    });
    return Promise.resolve();
  };

  const handleLogout = () => {
    setUser({
      id: 0,
      email: '',
      name: '',
      role: 'guest',
      isAuthenticated: false
    });
  };

  const handleRegister = (data: any) => {
    // Mock registration
    setUser({
      id: Date.now(),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      role: 'user',
      isAuthenticated: true
    });
    return Promise.resolve();
  };

  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
    children, 
    requireAdmin = false 
  }) => {
    if (!user.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (requireAdmin && user.role !== 'admin') {
      return <Navigate to="/" />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
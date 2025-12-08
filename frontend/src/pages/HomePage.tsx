import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ComplexGrid from '../components/Complex/ComplexGrid';

interface Complex {
  id: number;
  name: string;
  description: string;
  price_per_square: number;
  location: string;
  construction_stage: string;
  amenities: string[];
}

const HomePage: React.FC = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/complexes?limit=6');
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      setComplexes(data.complexes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Жилых комплексов', value: complexes.length },
    { label: 'Средняя цена за м²', value: '145,000 ₽' },
    { label: 'Квартир в продаже', value: '1,245' },
    { label: 'Довольных клиентов', value: '892' }
  ];

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Ошибка</h2>
        <p>{error}</p>
        <button 
          onClick={fetchData}
          className="btn-primary"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: 'var(--border-radius)',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Найдите идеальную квартиру для жизни
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
          Современные жилые комплексы от надежных застройщиков с выгодными условиями
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/catalog" className="btn-primary" style={{ background: 'white', color: 'var(--primary-color)' }}>
            Смотреть каталог
          </Link>
          <Link to="/calculator" className="btn-primary" style={{ background: 'transparent', border: '2px solid white' }}>
            Рассчитать стоимость
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>
          Property Store в цифрах
        </h2>
        <div className="grid cols-4" style={{ textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <div key={index} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-light)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Complexes */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>Популярные жилые комплексы</h2>
          <Link to="/catalog" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Все комплексы →
          </Link>
        </div>
        
        <ComplexGrid complexes={complexes} />
      </section>

      {/* Calculator Section */}
      <section style={{ 
        background: 'var(--secondary-color)', 
        padding: '3rem', 
        borderRadius: 'var(--border-radius)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
          Калькулятор стоимости квартиры
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          Узнайте точную стоимость квартиры в выбранном жилом комплексе
        </p>
        <Link to="/calculator" className="btn-primary">
          Перейти к калькулятору
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import ComplexGrid from '../components/Complex/ComplexGrid';

interface Complex {
  id: number;
  name: string;
  description: string;
  price_per_square: number;
  location: string;
  construction_stage: string;
  amenities: string[];
  delivery_date: string;
}

const CatalogPage: React.FC = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [filteredComplexes, setFilteredComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    constructionStage: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complexes, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/complexes');
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      setComplexes(data.complexes);
      setFilteredComplexes(data.complexes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complexes];

    if (filters.constructionStage) {
      filtered = filtered.filter(c => c.construction_stage === filters.constructionStage);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(c => c.price_per_square >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(c => c.price_per_square <= parseInt(filters.maxPrice));
    }

    setFilteredComplexes(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      constructionStage: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Загрузка каталога...</p>
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>Каталог жилых комплексов</h1>
        <p>Всего комплексов: {complexes.length}</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Фильтры</h3>
        <div className="grid cols-3" style={{ gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Стадия строительства
            </label>
            <select
              name="constructionStage"
              value={filters.constructionStage}
              onChange={handleFilterChange}
              style={{ width: '100%' }}
            >
              <option value="">Все</option>
              <option value="planning">Планирование</option>
              <option value="construction">Строительство</option>
              <option value="completed">Сдан</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Минимальная цена (₽/м²)
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="100000"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Максимальная цена (₽/м²)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="200000"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={applyFilters} className="btn-primary">
            Применить фильтры
          </button>
          <button onClick={resetFilters} className="btn-secondary">
            Сбросить фильтры
          </button>
          <div style={{ marginLeft: 'auto', color: 'var(--text-light)' }}>
            Найдено: {filteredComplexes.length} комплексов
          </div>
        </div>
      </div>

      {/* Complexes Grid */}
      {filteredComplexes.length > 0 ? (
        <ComplexGrid complexes={filteredComplexes} />
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            По вашему запросу ничего не найдено
          </h3>
          <button onClick={resetFilters} className="btn-primary">
            Сбросить фильтры
          </button>
        </div>
      )}

      {/* Construction Stages Info */}
      <div className="card" style={{ marginTop: '3rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
          Стадии строительства
        </h3>
        <div className="grid cols-3" style={{ gap: '1rem' }}>
          <div style={{ 
            background: '#ffc10720', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            borderLeft: '4px solid var(--warning-color)'
          }}>
            <h4 style={{ color: 'var(--warning-color)' }}>Планирование</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Проект на стадии разработки, предварительное бронирование
            </p>
          </div>
          
          <div style={{ 
            background: '#17a2b820', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            borderLeft: '4px solid #17a2b8'
          }}>
            <h4 style={{ color: '#17a2b8' }}>Строительство</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Активное строительство, доступны к покупке
            </p>
          </div>
          
          <div style={{ 
            background: '#28a74520', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            borderLeft: '4px solid var(--success-color)'
          }}>
            <h4 style={{ color: 'var(--success-color)' }}>Сдан</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Готов к заселению, можно переехать сразу
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
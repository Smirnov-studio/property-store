import React, { useState, useEffect } from 'react';

interface Complex {
  id: number;
  name: string;
  location: string;
  price_per_square: number;
  construction_stage: string;
  delivery_date: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price_per_square: '',
    construction_stage: 'construction',
    delivery_date: ''
  });

  useEffect(() => {
    fetchComplexes();
  }, []);

  const fetchComplexes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/complexes?limit=100');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call - in real app, this would be a POST/PUT request
    if (editingId) {
      // Update existing complex
      setComplexes(prev => prev.map(c => 
        c.id === editingId 
          ? { 
              ...c, 
              ...formData, 
              price_per_square: parseInt(formData.price_per_square),
              id: editingId 
            }
          : c
      ));
      alert('ЖК успешно обновлен!');
    } else {
      // Create new complex
      const newComplex: Complex = {
        id: Date.now(),
        name: formData.name,
        location: formData.location,
        price_per_square: parseInt(formData.price_per_square),
        construction_stage: formData.construction_stage,
        delivery_date: formData.delivery_date,
        created_at: new Date().toISOString()
      };
      setComplexes(prev => [newComplex, ...prev]);
      alert('ЖК успешно создан!');
    }
    
    resetForm();
  };

  const handleEdit = (complex: Complex) => {
    setEditingId(complex.id);
    setFormData({
      name: complex.name,
      location: complex.location,
      price_per_square: complex.price_per_square.toString(),
      construction_stage: complex.construction_stage,
      delivery_date: complex.delivery_date
    });
    setShowForm(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Удалить ЖК "${name}"?`)) {
      setComplexes(prev => prev.filter(c => c.id !== id));
      alert('ЖК удален!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      price_per_square: '',
      construction_stage: 'construction',
      delivery_date: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'var(--warning-color)';
      case 'construction': return '#17a2b8';
      case 'completed': return 'var(--success-color)';
      default: return 'var(--text-light)';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'planning': return 'Планирование';
      case 'construction': return 'Строительство';
      case 'completed': return 'Сдан';
      default: return stage;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Загрузка админ-панели...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Ошибка</h2>
        <p>{error}</p>
        <button 
          onClick={fetchComplexes}
          className="btn-primary"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>👑 Админ-панель</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary"
        >
          {showForm ? '❌ Отмена' : '➕ Создать ЖК'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)', 
          color: 'white',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Всего ЖК</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{complexes.length}</div>
        </div>
        
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #4a5568 0%, #718096 100%)', 
          color: 'white',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>В строительстве</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {complexes.filter(c => c.construction_stage === 'construction').length}
          </div>
        </div>
        
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #9f7aea 0%, #b794f4 100%)', 
          color: 'white',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Сданы</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {complexes.filter(c => c.construction_stage === 'completed').length}
          </div>
        </div>
        
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)', 
          color: 'white',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Планируются</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {complexes.filter(c => c.construction_stage === 'planning').length}
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            {editingId ? 'Редактирование ЖК' : 'Создание нового ЖК'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Название ЖК *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Местоположение *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Цена за м² (₽) *
                </label>
                <input
                  type="number"
                  name="price_per_square"
                  value={formData.price_per_square}
                  onChange={handleInputChange}
                  required
                  min="10000"
                  step="1000"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Стадия строительства *
                </label>
                <select
                  name="construction_stage"
                  value={formData.construction_stage}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="planning">Планирование</option>
                  <option value="construction">Строительство</option>
                  <option value="completed">Сдан</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Срок сдачи *
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Обновить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complexes Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          Список жилых комплексов
        </h2>
        
        {complexes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <p style={{ marginBottom: '1rem' }}>Нет жилых комплексов</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Создать первый ЖК
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Название</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Местоположение</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Цена за м²</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Стадия</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Сдача</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {complexes.map(complex => (
                  <tr key={complex.id} className="table-row">
                    <td style={{ padding: '1rem' }}>
                      <strong>{complex.name}</strong>
                    </td>
                    <td style={{ padding: '1rem' }}>{complex.location}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {complex.price_per_square.toLocaleString('ru-RU')} ₽
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        background: getStageBadgeColor(complex.construction_stage),
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {getStageLabel(complex.construction_stage)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(complex.delivery_date).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(complex)}
                          className="btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDelete(complex.id, complex.name)}
                          className="btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
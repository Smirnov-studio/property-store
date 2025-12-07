import React, { useState, useEffect } from 'react';
import './styles/global.scss';

// Типы данных
interface ApartmentLayout {
  rooms: number;
  area: number;
  floorPlans: string[];
}

interface ResidentialComplex {
  id: string;
  name: string;
  description: string;
  pricePerSquare: number;
  location: string;
  images: string[];
  layouts: ApartmentLayout[];
  amenities: string[];
  constructionStage: 'planning' | 'construction' | 'completed';
  deliveryDate: string;
}

interface CalculationResult {
  totalPrice: number;
  pricePerSquare: number;
  area: number;
  complexName: string;
}

// Мок данные
const mockComplexes: ResidentialComplex[] = [
  {
    id: 'northern',
    name: 'ЖК Северный',
    description: 'Современный жилой комплекс в экологически чистом районе с развитой инфраструктурой. Рядом парк, школы и детские сады. Подземный паркинг, современные лифты, система видеонаблюдения.',
    pricePerSquare: 120000,
    location: 'ул. Северная, 15',
    images: [],
    layouts: [
      { rooms: 1, area: 45, floorPlans: [] },
      { rooms: 2, area: 65, floorPlans: [] },
      { rooms: 3, area: 85, floorPlans: [] }
    ],
    amenities: ['паркинг', 'детская площадка', 'фитнес-центр', 'охрана', 'камеры наблюдения'],
    constructionStage: 'construction',
    deliveryDate: '2024-12-31'
  },
  {
    id: 'southern',
    name: 'ЖК Южные Сады',
    description: 'Комфортабельный комплекс с собственной инфраструктурой для комфортной жизни. Бассейн, спортивные площадки, зоны отдыха. Панорамные окна, высокие потолки, современная отделка.',
    pricePerSquare: 135000,
    location: 'пр. Южный, 42',
    images: [],
    layouts: [
      { rooms: 1, area: 40, floorPlans: [] },
      { rooms: 2, area: 60, floorPlans: [] },
      { rooms: 3, area: 80, floorPlans: [] },
      { rooms: 4, area: 100, floorPlans: [] }
    ],
    amenities: ['бассейн', 'спортивная площадка', 'подземный паркинг', 'детский клуб', 'ландшафтный дизайн'],
    constructionStage: 'completed',
    deliveryDate: '2023-06-15'
  },
  {
    id: 'central',
    name: 'ЖК Центральный',
    description: 'Элитный комплекс в историческом центре города с уникальной архитектурой. Высокий уровень безопасности, премиальная отделка, панорамные виды на город.',
    pricePerSquare: 180000,
    location: 'ул. Центральная, 7',
    images: [],
    layouts: [
      { rooms: 2, area: 55, floorPlans: [] },
      { rooms: 3, area: 75, floorPlans: [] },
      { rooms: 4, area: 95, floorPlans: [] }
    ],
    amenities: ['консьерж', 'VIP отделка', 'охраняемая территория', 'подземный паркинг', 'зимний сад'],
    constructionStage: 'planning',
    deliveryDate: '2025-09-30'
  }
];

// Утилита для форматирования валюты
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ru-RU') + ' ₽';
};

// Компонент результата расчета
const CalculatorResult: React.FC<{ result: CalculationResult }> = ({ result }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center',
      margin: '1.5rem 0'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Расчет стоимости</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        textAlign: 'left' as const
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span>Жилой комплекс:</span>
          <span>{result.complexName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span>Площадь:</span>
          <span>{result.area} м²</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span>Цена за м²:</span>
          <span>{formatCurrency(result.pricePerSquare)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <span>Общая стоимость:</span>
          <strong style={{ fontSize: '1.2rem' }}>{formatCurrency(result.totalPrice)}</strong>
        </div>
      </div>
    </div>
  );
};

// Компонент формы расчета
const ApartmentForm: React.FC = () => {
  const [complexes] = useState<ResidentialComplex[]>(mockComplexes);
  const [selectedComplex, setSelectedComplex] = useState<ResidentialComplex | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // Расчет стоимости при выборе комнат
  useEffect(() => {
    if (selectedComplex && selectedRooms) {
      const layout = selectedComplex.layouts.find(layout => layout.rooms === selectedRooms);
      if (layout) {
        const totalPrice = selectedComplex.pricePerSquare * layout.area;
        setCalculationResult({
          totalPrice,
          pricePerSquare: selectedComplex.pricePerSquare,
          area: layout.area,
          complexName: selectedComplex.name
        });
      }
    } else {
      setCalculationResult(null);
    }
  }, [selectedComplex, selectedRooms]);

  const handleComplexChange = (complexId: string) => {
    const complex = complexes.find(c => c.id === complexId) || null;
    setSelectedComplex(complex);
    setSelectedRooms(null);
  };

  const availableRooms = selectedComplex 
    ? [...new Set(selectedComplex.layouts.map(layout => layout.rooms))].sort()
    : [];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e5e9'
    }}>
      <h2 style={{
        color: '#2c5530',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '1.5rem'
      }}>
        Калькулятор стоимости квартиры
      </h2>
      
      {/* Выбор ЖК */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 600,
          color: '#374151'
        }}>
          Выберите жилой комплекс:
        </label>
        <select
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
          value={selectedComplex?.id || ''}
          onChange={(e) => handleComplexChange(e.target.value)}
        >
          <option value="">-- Выберите ЖК --</option>
          {complexes.map(complex => (
            <option key={complex.id} value={complex.id}>
              {complex.name} - от {complex.pricePerSquare.toLocaleString()} ₽/м²
            </option>
          ))}
        </select>
      </div>

      {/* Выбор количества комнат */}
      {selectedComplex && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#374151'
          }}>
            Количество комнат:
          </label>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {availableRooms.map(rooms => (
              <button
                key={rooms}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #e5e7eb',
                  background: selectedRooms === rooms ? '#2c5530' : 'white',
                  color: selectedRooms === rooms ? 'white' : 'inherit',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
                onClick={() => setSelectedRooms(rooms)}
              >
                {rooms}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Информация о выбранной квартире */}
      {selectedComplex && selectedRooms && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          margin: '1.5rem 0',
          borderLeft: '4px solid #2c5530'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5530' }}>Информация о квартире</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span>Жилой комплекс:</span>
              <strong>{selectedComplex.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span>Количество комнат:</span>
              <strong>{selectedRooms}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span>Площадь:</span>
              <strong>{calculationResult?.area} м²</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span>Цена за м²:</span>
              <strong>{selectedComplex.pricePerSquare.toLocaleString()} ₽</strong>
            </div>
          </div>
        </div>
      )}

      {/* Результат расчета */}
      {calculationResult && (
        <CalculatorResult result={calculationResult} />
      )}

      {/* Детали ЖК */}
      {selectedComplex && (
        <div style={{
          background: 'white',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2c5530' }}>О жилом комплексе</h4>
          <p>{selectedComplex.description}</p>
          <div style={{ margin: '1rem 0' }}>
            <strong>Удобства:</strong>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              {selectedComplex.amenities.map((amenity, index) => (
                <span 
                  key={index}
                  style={{
                    background: '#e8f5e8',
                    color: '#2c5530',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    border: '1px solid #c8e6c9'
                  }}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>Срок сдачи:</strong> {new Date(selectedComplex.deliveryDate).toLocaleDateString('ru-RU')}
          </div>
        </div>
      )}
    </div>
  );
};

// Главный компонент приложения
const App: React.FC = () => {
  return (
    <div className="app">
      <header style={{
        background: '#2c5530',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🏠 Property Store</h1>
        </div>
      </header>
      
      <main className="container" style={{ padding: '2rem 0' }}>
        {/* Герой секция */}
        <section style={{
          background: 'linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Найдите свою идеальную квартиру</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Рассчитайте стоимость и выберите лучший вариант
          </p>
        </section>

        {/* Секция с формой расчета */}
        <section style={{ marginBottom: '3rem' }}>
          <ApartmentForm />
        </section>

        {/* Информационная секция */}
        <section style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#2c5530', marginBottom: '1rem' }}>Как работает расчет?</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
              <h4>Выберите ЖК</h4>
              <p>Выберите понравившийся жилой комплекс из нашего каталога</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚪</div>
              <h4>Укажите комнаты</h4>
              <p>Выберите количество комнат в будущей квартире</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <h4>Получите расчет</h4>
              <p>Система автоматически рассчитает стоимость вашей квартиры</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer style={{
        background: '#f8f9fa',
        padding: '2rem 0',
        textAlign: 'center',
        marginTop: '3rem',
        borderTop: '1px solid #e9ecef'
      }}>
        <div className="container">
          <p style={{ margin: 0, color: '#6c757d' }}>
            &copy; 2024 Property Store. Все права защищены.
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
            Цены указаны для ознакомления и могут меняться
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
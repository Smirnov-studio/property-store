import React, { useState, useEffect } from 'react';
import CalculatorForm from '../components/Calculator/CalculatorForm';
import CalculatorResult from '../components/Calculator/CalculatorResult';

interface Complex {
  id: number;
  name: string;
  price_per_square: number;
  layouts: Array<{ rooms: number; area: number }>;
}

interface CalculationResult {
  complexId: number;
  complexName: string;
  rooms: number;
  area: number;
  pricePerSquare: number;
  totalPrice: number;
}

const CalculatorPage: React.FC = () => {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);

  useEffect(() => {
    fetchComplexes();
    // Load history from localStorage
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      setCalculationHistory(JSON.parse(savedHistory));
    }
  }, []);

  const fetchComplexes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/complexes');
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

  const handleCalculate = async (complexId: number, rooms: number, area: number) => {
    try {
      const response = await fetch('http://localhost:3001/api/complexes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complexId, rooms, area }),
      });

      if (!response.ok) {
        throw new Error('Ошибка расчета');
      }

      const result = await response.json();
      const calculationResult: CalculationResult = {
        complexId,
        complexName: result.complexName,
        rooms,
        area,
        pricePerSquare: result.pricePerSquare,
        totalPrice: result.totalPrice
      };

      setCalculation(calculationResult);
      
      // Save to history
      const newHistory = [calculationResult, ...calculationHistory.slice(0, 4)];
      setCalculationHistory(newHistory);
      localStorage.setItem('calculationHistory', JSON.stringify(newHistory));

    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Загрузка калькулятора...</p>
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>Калькулятор стоимости квартиры</h1>
        <p>Рассчитайте точную стоимость квартиры в выбранном жилом комплексе</p>
      </div>

      <div className="grid cols-2" style={{ gap: '2rem' }}>
        {/* Left Column: Calculator Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <CalculatorForm 
            complexes={complexes} 
            onCalculate={handleCalculate}
          />
        </div>

        {/* Right Column: Results and History */}
        <div>
          {calculation && (
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Результат расчета
              </h3>
              <CalculatorResult result={calculation} />
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button 
                  className="btn-primary"
                  onClick={() => window.print()}
                  style={{ marginRight: '1rem' }}
                >
                  📄 Распечатать расчет
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => setCalculation(null)}
                >
                  Новый расчет
                </button>
              </div>
            </div>
          )}

          {/* Calculation History */}
          {calculationHistory.length > 0 && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--primary-color)' }}>История расчетов</h3>
                <button 
                  onClick={clearHistory}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Очистить историю
                </button>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {calculationHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="history-item"
                    onClick={() => setCalculation(item)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{item.complexName}</strong>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                          {item.rooms} комн. • {item.area} м²
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {item.totalPrice.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="card" style={{ marginTop: '3rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
          Как работает калькулятор?
        </h3>
        <div className="grid cols-3" style={{ gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'var(--primary-color)', 
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>
              1
            </div>
            <h4>Выберите ЖК</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Выберите жилой комплекс из нашего каталога
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'var(--primary-color)', 
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>
              2
            </div>
            <h4>Укажите параметры</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Выберите количество комнат и площадь квартиры
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'var(--primary-color)', 
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>
              3
            </div>
            <h4>Получите расчет</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Сразу увидите точную стоимость квартиры
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
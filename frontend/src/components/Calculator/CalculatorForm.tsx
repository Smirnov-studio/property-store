import React, { useState, useEffect } from 'react';

interface Complex {
  id: number;
  name: string;
  price_per_square: number;
  layouts: Array<{ rooms: number; area: number }>;
}

interface CalculatorFormProps {
  complexes: Complex[];
  onCalculate: (complexId: number, rooms: number, area: number) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ complexes, onCalculate }) => {
  const [selectedComplex, setSelectedComplex] = useState<Complex | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [customArea, setCustomArea] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);

  useEffect(() => {
    if (complexes.length > 0 && !selectedComplex) {
      setSelectedComplex(complexes[0]);
    }
  }, [complexes]);

  useEffect(() => {
    if (selectedComplex) {
      const rooms = Array.from(
        new Set(selectedComplex.layouts.map(l => l.rooms))
      ).sort((a, b) => a - b);
      setAvailableRooms(rooms);
      if (rooms.length > 0) {
        setSelectedRooms(rooms[0]);
      }
    }
  }, [selectedComplex]);

  const handleComplexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const complexId = parseInt(e.target.value);
    const complex = complexes.find(c => c.id === complexId);
    setSelectedComplex(complex || null);
  };

  const handleRoomChange = (rooms: number) => {
    setSelectedRooms(rooms);
    const layout = selectedComplex?.layouts.find(l => l.rooms === rooms);
    if (layout) {
      setCustomArea(layout.area.toString());
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomArea(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedComplex || !selectedRooms || !customArea) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    const area = parseFloat(customArea);
    if (isNaN(area) || area <= 0) {
      alert('Пожалуйста, введите корректную площадь');
      return;
    }
    
    onCalculate(selectedComplex.id, selectedRooms, area);
  };

  const calculatePrice = () => {
    if (!selectedComplex || !customArea) return 0;
    const area = parseFloat(customArea) || 0;
    return selectedComplex.price_per_square * area;
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
        Калькулятор стоимости
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Выберите жилой комплекс
          </label>
          <select
            value={selectedComplex?.id || ''}
            onChange={handleComplexChange}
            style={{ width: '100%' }}
          >
            {complexes.map(complex => (
              <option key={complex.id} value={complex.id}>
                {complex.name} - от {complex.price_per_square.toLocaleString('ru-RU')} ₽/м²
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Количество комнат
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableRooms.map(rooms => (
              <button
                key={rooms}
                type="button"
                onClick={() => handleRoomChange(rooms)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: `2px solid ${selectedRooms === rooms ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  background: selectedRooms === rooms ? 'var(--primary-color)' : 'white',
                  color: selectedRooms === rooms ? 'white' : 'var(--text-color)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {rooms}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Площадь квартиры (м²)
          </label>
          <input
            type="number"
            value={customArea}
            onChange={handleAreaChange}
            placeholder="Введите площадь"
            min="10"
            step="0.1"
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Стандартные планировки: {selectedComplex?.layouts
              .filter(l => l.rooms === selectedRooms)
              .map(l => `${l.area} м²`)
              .join(', ')}
          </div>
        </div>
        
        {/* Price Preview */}
        <div className="card" style={{ 
          background: 'var(--secondary-color)', 
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span>Цена за м²:</span>
            <strong>{selectedComplex?.price_per_square.toLocaleString('ru-RU')} ₽</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span>Площадь:</span>
            <strong>{customArea || '0'} м²</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <span>Примерная стоимость:</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
              {calculatePrice().toLocaleString('ru-RU')} ₽
            </strong>
          </div>
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          📊 Рассчитать точную стоимость
        </button>
      </form>
    </div>
  );
};

export default CalculatorForm;
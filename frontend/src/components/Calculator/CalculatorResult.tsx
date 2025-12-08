import React from 'react';

interface CalculationResult {
  complexId: number;
  complexName: string;
  rooms: number;
  area: number;
  pricePerSquare: number;
  totalPrice: number;
}

interface CalculatorResultProps {
  result: CalculationResult;
}

const CalculatorResult: React.FC<CalculatorResultProps> = ({ result }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
          Итоговая стоимость
        </h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          {formatCurrency(result.totalPrice)}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
          {formatCurrency(result.pricePerSquare)} × {result.area} м²
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
          Детали расчета
        </h4>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span>Жилой комплекс:</span>
            <strong>{result.complexName}</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span>Количество комнат:</span>
            <strong>{result.rooms}</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span>Площадь квартиры:</span>
            <strong>{result.area} м²</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span>Цена за квадратный метр:</span>
            <strong>{formatCurrency(result.pricePerSquare)}</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span>Общая стоимость:</span>
            <strong style={{ color: 'var(--primary-color)' }}>
              {formatCurrency(result.totalPrice)}
            </strong>
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: 'var(--border-radius)',
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-light)'
      }}>
        <p style={{ margin: 0 }}>
          💡 <strong>Совет:</strong> Для более точного расчета рекомендуется 
          обратиться к нашему менеджеру для учета скидок и актуальных предложений.
        </p>
      </div>
    </div>
  );
};

export default CalculatorResult;
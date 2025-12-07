import React from 'react';
import { CalculationResult } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import styles from './CalculatorResult.module.scss';

interface CalculatorResultProps {
  result: CalculationResult;
}

const CalculatorResult: React.FC<CalculatorResultProps> = ({ result }) => {
  return (
    <div className={styles.result}>
      <h3>Расчет стоимости</h3>
      <div className={styles.resultGrid}>
        <div className={styles.resultItem}>
          <span>Жилой комплекс:</span>
          <span>{result.complexName}</span>
        </div>
        <div className={styles.resultItem}>
          <span>Площадь:</span>
          <span>{result.area} м²</span>
        </div>
        <div className={styles.resultItem}>
          <span>Цена за м²:</span>
          <span>{formatCurrency(result.pricePerSquare)}</span>
        </div>
        <div className={styles.resultItem}>
          <span>Общая стоимость:</span>
          <strong>{formatCurrency(result.totalPrice)}</strong>
        </div>
      </div>
    </div>
  );
};

export default CalculatorResult;
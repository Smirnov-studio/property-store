import React, { useState, useEffect } from 'react';
import { ResidentialComplex } from '../../../types';
import { useComplexes } from '../../../hooks/useComplexes';
import styles from './ApartmentForm.module.scss';

const ApartmentForm: React.FC = () => {
  // Добавляем защиту от undefined
  const complexesData = useComplexes();
  
  // Если хук вернул undefined, используем значения по умолчанию
  const { complexes = [], loading = false } = complexesData || {};
  
  const [selectedComplex, setSelectedComplex] = useState<ResidentialComplex | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);

  // Сбрасываем выбор комнат и расчет при смене ЖК
  useEffect(() => {
    setSelectedRooms(null);
    setTotalPrice(null);
    setArea(null);
  }, [selectedComplex]);

  // Расчет стоимости при выборе комнат
  useEffect(() => {
    if (selectedComplex && selectedRooms) {
      const layout = selectedComplex.layouts.find(layout => layout.rooms === selectedRooms);
      if (layout) {
        setArea(layout.area);
        const calculatedPrice = selectedComplex.pricePerSquare * layout.area;
        setTotalPrice(calculatedPrice);
      }
    }
  }, [selectedComplex, selectedRooms]);

  const handleComplexChange = (complexId: string) => {
    const complex = complexes.find(c => c.id === complexId) || null;
    setSelectedComplex(complex);
  };

  const handleRoomsChange = (rooms: number) => {
    setSelectedRooms(rooms);
  };

  const availableRooms = selectedComplex 
    ? [...new Set(selectedComplex.layouts.map(layout => layout.rooms))].sort()
    : [];

  if (loading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Калькулятор стоимости квартиры</h2>
      
      <div className={styles.field}>
        <label htmlFor="complex-select" className={styles.label}>
          Выберите жилой комплекс:
        </label>
        <select
          id="complex-select"
          className={styles.select}
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

      {selectedComplex && (
        <div className={styles.field}>
          <label className={styles.label}>Количество комнат:</label>
          <div className={styles.rooms}>
            {availableRooms.map(rooms => (
              <button
                key={rooms}
                className={`${styles.roomButton} ${
                  selectedRooms === rooms ? styles.roomButtonActive : ''
                }`}
                onClick={() => handleRoomsChange(rooms)}
              >
                {rooms}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedComplex && selectedRooms && (
        <div className={styles.apartmentInfo}>
          <h3>Информация о квартире</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>Жилой комплекс:</span>
              <strong>{selectedComplex.name}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Количество комнат:</span>
              <strong>{selectedRooms}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Площадь:</span>
              <strong>{area} м²</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Цена за м²:</span>
              <strong>{selectedComplex.pricePerSquare.toLocaleString()} ₽</strong>
            </div>
          </div>
        </div>
      )}

      {totalPrice && (
        <div className={styles.result}>
          <h3>Расчет стоимости</h3>
          <div className={styles.price}>
            {totalPrice.toLocaleString()} ₽
          </div>
          <div className={styles.formula}>
            {selectedComplex?.pricePerSquare.toLocaleString()} ₽/м² × {area} м² = {totalPrice.toLocaleString()} ₽
          </div>
        </div>
      )}

      {selectedComplex && (
        <div className={styles.complexDetails}>
          <h4>О жилом комплексе</h4>
          <p>{selectedComplex.description}</p>
          <div className={styles.amenities}>
            <strong>Удобства:</strong>
            <div className={styles.amenitiesList}>
              {selectedComplex.amenities.map((amenity, index) => (
                <span key={index} className={styles.amenity}>{amenity}</span>
              ))}
            </div>
          </div>
          <div className={styles.delivery}>
            <strong>Срок сдачи:</strong> {new Date(selectedComplex.deliveryDate).toLocaleDateString('ru-RU')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentForm;
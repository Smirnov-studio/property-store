import React from 'react';
import { ResidentialComplex } from '../../../types';
import { formatPricePerSquare, formatDate } from '../../../utils/formatters';
import styles from './ComplexCard.module.scss';

interface ComplexCardProps {
  complex: ResidentialComplex;
  onSelect: (complex: ResidentialComplex) => void;
}

const ComplexCard: React.FC<ComplexCardProps> = ({ complex, onSelect }) => {
  return (
    <div className={styles.card} onClick={() => onSelect(complex)}>
      <img 
        src={complex.images[0]} 
        alt={complex.name} 
        className={styles.image}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/images/placeholder.jpg';
        }}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{complex.name}</h3>
        <p className={styles.location}>{complex.location}</p>
        <p className={styles.price}>
          от {formatPricePerSquare(complex.pricePerSquare)}
        </p>
        <p className={styles.description}>{complex.description}</p>
        <div className={styles.amenities}>
          {complex.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} className={styles.amenity}>{amenity}</span>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.stage}>{complex.constructionStage}</span>
          <span className={styles.date}>Сдача: {formatDate(complex.deliveryDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplexCard;
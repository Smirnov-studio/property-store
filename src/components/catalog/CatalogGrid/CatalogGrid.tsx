import React from 'react';
import { ResidentialComplex } from '../../../types';
import ComplexCard from '../ComplexCard/ComplexCard';
import styles from './CatalogGrid.module.scss';

interface CatalogGridProps {
  complexes: ResidentialComplex[];
  onComplexSelect: (complex: ResidentialComplex) => void;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ complexes, onComplexSelect }) => {
  return (
    <div className={styles.grid}>
      {complexes.map(complex => (
        <ComplexCard 
          key={complex.id} 
          complex={complex} 
          onSelect={onComplexSelect}
        />
      ))}
    </div>
  );
};

export default CatalogGrid;
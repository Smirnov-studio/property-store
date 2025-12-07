import React from 'react';
import styles from './Filters.module.scss';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  return (
    <div className={styles.filters}>
      <h3>Фильтры</h3>
      {/* Здесь будут фильтры */}
      <p>Фильтры в разработке...</p>
    </div>
  );
};

export default Filters;
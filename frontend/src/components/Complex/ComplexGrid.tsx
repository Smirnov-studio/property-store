import React from 'react';
import ComplexCard from './ComplexCard';

interface Complex {
  id: number;
  name: string;
  description: string;
  price_per_square: number;
  location: string;
  construction_stage: string;
  amenities: string[];
  delivery_date?: string;
}

interface ComplexGridProps {
  complexes: Complex[];
}

const ComplexGrid: React.FC<ComplexGridProps> = ({ complexes }) => {
  return (
    <div className="grid cols-3">
      {complexes.map(complex => (
        <ComplexCard key={complex.id} complex={complex} />
      ))}
    </div>
  );
};

export default ComplexGrid;
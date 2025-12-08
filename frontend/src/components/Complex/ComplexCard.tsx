import React from 'react';
import styles from './ComplexCard.module.css';

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

interface ComplexCardProps {
  complex: Complex;
}

const ComplexCard: React.FC<ComplexCardProps> = ({ complex }) => {
  const getStageColorClass = (stage: string) => {
    switch (stage) {
      case 'planning': return styles.statusPlanning;
      case 'construction': return styles.statusConstruction;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'planning': return 'Планирование';
      case 'construction': return 'Строительство';
      case 'completed': return 'Сдан';
      default: return stage;
    }
  };

  return (
    <div className={styles.card}>
      <div style={{ 
        height: '200px', 
        background: `linear-gradient(135deg, ${
          complex.construction_stage === 'planning' ? '#ffc10740' : 
          complex.construction_stage === 'construction' ? '#17a2b840' : '#28a74540'
        } 0%, var(--primary-color)20 100%)`,
        position: 'relative',
        padding: '1.5rem'
      }}>
        <span className={`${getStageColorClass(complex.construction_stage)}`} style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          {getStageLabel(complex.construction_stage)}
        </span>
        
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          right: '1.5rem'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: 'var(--primary-color)',
            fontSize: '1.5rem'
          }}>
            {complex.name}
          </h3>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: 'var(--text-light)',
            fontSize: '0.9rem'
          }}>
            {complex.location}
          </p>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'var(--primary-color)',
          marginBottom: '1rem'
        }}>
          от {complex.price_per_square.toLocaleString('ru-RU')} ₽/м²
        </div>
        
        <p style={{ 
          color: 'var(--text-light)', 
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {complex.description}
        </p>
        
        {complex.delivery_date && (
          <div style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-light)',
            marginBottom: '1rem'
          }}>
            📅 Сдача: {new Date(complex.delivery_date).toLocaleDateString('ru-RU')}
          </div>
        )}
        
        {complex.amenities && complex.amenities.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {complex.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  style={{
                    background: 'var(--secondary-color)',
                    color: 'var(--text-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}
                >
                  {amenity}
                </span>
              ))}
              {complex.amenities.length > 3 && (
                <span style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  +{complex.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexCard;
import { ResidentialComplex } from '../types';

const mockComplexes: ResidentialComplex[] = [
  {
    id: 'northern',
    name: 'ЖК Северный',
    description: 'Современный жилой комплекс в экологически чистом районе.',
    pricePerSquare: 120000,
    location: 'ул. Северная, 15',
    images: [],
    layouts: [
      { rooms: 1, area: 45, floorPlans: [] },
      { rooms: 2, area: 65, floorPlans: [] },
      { rooms: 3, area: 85, floorPlans: [] }
    ],
    amenities: ['паркинг', 'детская площадка', 'фитнес-центр'],
    constructionStage: 'construction',
    deliveryDate: '2024-12-31'
  },
  {
    id: 'southern',
    name: 'ЖК Южные Сады',
    description: 'Комфортабельный комплекс с собственной инфраструктурой.',
    pricePerSquare: 135000,
    location: 'пр. Южный, 42',
    images: [],
    layouts: [
      { rooms: 1, area: 40, floorPlans: [] },
      { rooms: 2, area: 60, floorPlans: [] },
      { rooms: 3, area: 80, floorPlans: [] }
    ],
    amenities: ['бассейн', 'спортивная площадка', 'подземный паркинг'],
    constructionStage: 'completed',
    deliveryDate: '2023-06-15'
  }
];

// Упрощенная версия без состояния - сразу возвращает данные
export const useComplexes = () => {
  return {
    complexes: mockComplexes,
    loading: false,
    getComplexById: (id: string) => mockComplexes.find(c => c.id === id)
  };
};
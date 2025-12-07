import { ResidentialComplex } from '../types';

export const complexes: ResidentialComplex[] = [
  {
    id: 'northern',
    name: 'ЖК Северный',
    description: 'Современный жилой комплекс в экологически чистом районе',
    pricePerSquare: 120000,
    location: 'ул. Северная, 15',
    images: ['/assets/images/northern-1.jpg'],
    layouts: [
      { rooms: 1, area: 45, floorPlans: ['/assets/images/plan-1-1.jpg'] },
      { rooms: 2, area: 65, floorPlans: ['/assets/images/plan-2-1.jpg'] },
      { rooms: 3, area: 85, floorPlans: ['/assets/images/plan-3-1.jpg'] }
    ],
    amenities: ['паркинг', 'детская площадка', 'фитнес-центр'],
    constructionStage: 'construction',
    deliveryDate: '2024-12-31'
  },
  {
    id: 'southern',
    name: 'ЖК Южные Сады',
    description: 'Комфортабельный комплекс с собственной инфраструктурой',
    pricePerSquare: 135000,
    location: 'пр. Южный, 42',
    images: ['/assets/images/southern-1.jpg'],
    layouts: [
      { rooms: 1, area: 40, floorPlans: ['/assets/images/plan-1-2.jpg'] },
      { rooms: 2, area: 60, floorPlans: ['/assets/images/plan-2-2.jpg'] },
      { rooms: 3, area: 80, floorPlans: ['/assets/images/plan-3-2.jpg'] },
      { rooms: 4, area: 100, floorPlans: ['/assets/images/plan-4-1.jpg'] }
    ],
    amenities: ['бассейн', 'спортивная площадка', 'подземный паркинг'],
    constructionStage: 'completed',
    deliveryDate: '2023-06-15'
  },
  {
    id: 'central',
    name: 'ЖК Центральный',
    description: 'Элитный комплекс в историческом центре города',
    pricePerSquare: 180000,
    location: 'ул. Центральная, 7',
    images: ['/assets/images/central-1.jpg'],
    layouts: [
      { rooms: 2, area: 55, floorPlans: ['/assets/images/plan-2-3.jpg'] },
      { rooms: 3, area: 75, floorPlans: ['/assets/images/plan-3-3.jpg'] },
      { rooms: 4, area: 95, floorPlans: ['/assets/images/plan-4-2.jpg'] }
    ],
    amenities: ['консьерж', "VIP-отделка", 'охраняемая территория'],
    constructionStage: 'planning',
    deliveryDate: '2025-09-30'
  }
];
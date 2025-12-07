export interface ApartmentLayout {
  rooms: number;
  area: number;
  floorPlans: string[];
}

export interface ResidentialComplex {
  id: string;
  name: string;
  description: string;
  pricePerSquare: number;
  location: string;
  images: string[];
  layouts: ApartmentLayout[];
  amenities: string[];
  constructionStage: 'planning' | 'construction' | 'completed';
  deliveryDate: string;
}

export interface CalculationParams {
  complexId: string;
  rooms: number;
  area: number;
}

export interface CalculationResult {
  totalPrice: number;
  pricePerSquare: number;
  area: number;
  complexName: string;
}
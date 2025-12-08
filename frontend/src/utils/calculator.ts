import { ResidentialComplex, CalculationResult } from '../types';

export const calculateApartmentPrice = (
  complex: ResidentialComplex,
  area: number
): CalculationResult => {
  const totalPrice = complex.pricePerSquare * area;
  
  return {
    totalPrice,
    pricePerSquare: complex.pricePerSquare,
    area,
    complexName: complex.name
  };
};

export const getAvailableRooms = (complex: ResidentialComplex): number[] => {
  return complex.layouts.map(layout => layout.rooms);
};

export const getAreaByRooms = (complex: ResidentialComplex, rooms: number): number => {
  const layout = complex.layouts.find(l => l.rooms === rooms);
  return layout ? layout.area : 0;
};
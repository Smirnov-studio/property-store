export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ru-RU') + ' ₽';
};

export const formatPricePerSquare = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽/м²';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};
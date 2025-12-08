import { useState, useEffect, useCallback } from 'react';
import { complexAPI } from '../services/api';
import { ResidentialComplex } from '../types';

interface UseComplexesReturn {
  complexes: ResidentialComplex[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  getComplexById: (id: string) => ResidentialComplex | undefined;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useComplexes = (
  initialPage: number = 1,
  limit: number = 10,
  filters: any = {}
): UseComplexesReturn => {
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const loadComplexes = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await complexAPI.getAll({
        page: pageNum,
        limit,
        ...filters
      });
      
      const { complexes: apiComplexes, pagination } = response.data;
      
      // Преобразуем данные из API в формат ResidentialComplex
      const formattedComplexes = apiComplexes.map((apiComplex: any) => ({
        id: apiComplex.id.toString(),
        name: apiComplex.name,
        description: apiComplex.description,
        pricePerSquare: apiComplex.price_per_square,
        location: apiComplex.location,
        address: apiComplex.address,
        developer: apiComplex.developer,
        images: apiComplex.images || [],
        layouts: apiComplex.layouts || [],
        amenities: apiComplex.amenities || [],
        constructionStage: apiComplex.construction_stage,
        deliveryDate: apiComplex.delivery_date,
        createdAt: apiComplex.created_at,
        updatedAt: apiComplex.updated_at
      }));
      
      if (append) {
        setComplexes(prev => [...prev, ...formattedComplexes]);
      } else {
        setComplexes(formattedComplexes);
      }
      
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки данных');
      console.error('Error loading complexes:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, filters]);

  const getComplexById = useCallback((id: string) => {
    return complexes.find(c => c.id === id);
  }, [complexes]);

  const refresh = useCallback(async () => {
    await loadComplexes(1, false);
  }, [loadComplexes]);

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      await loadComplexes(page + 1, true);
    }
  }, [page, totalPages, loading, loadComplexes]);

  useEffect(() => {
    loadComplexes(1, false);
  }, [loadComplexes]);

  return {
    complexes,
    loading,
    error,
    total,
    page,
    totalPages,
    getComplexById,
    refresh,
    loadMore
  };
};
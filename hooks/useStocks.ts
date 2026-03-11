import { useQuery } from '@tanstack/react-query';

const fetchStockData = async (symbol: string) => {
  const response = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
  if (!response.ok) throw new Error('Failed to fetch stock data');
  return response.json();
};

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockData(symbol),
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Auto refresh every minute
  });
};

const fetchTopGainers = async () => {
  const response = await fetch(`/api/market?endpoint=/v2/snapshot/locale/us/markets/stocks/gainers`);
  if (!response.ok) throw new Error('Failed to fetch gainers');
  return response.json();
};

export const useTopGainers = () => {
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: fetchTopGainers,
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

const fetchTopLosers = async () => {
  const response = await fetch(`/api/market?endpoint=/v2/snapshot/locale/us/markets/stocks/losers`);
  if (!response.ok) throw new Error('Failed to fetch losers');
  return response.json();
};

export const useTopLosers = () => {
  return useQuery({
    queryKey: ['topLosers'],
    queryFn: fetchTopLosers,
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

import { useQuery } from '@tanstack/react-query';

const fetchFuturesData = async (symbol: string) => {
  const response = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
  if (!response.ok) throw new Error('Failed to fetch futures data');
  return response.json();
};

export const useFuturesData = (symbol: string) => {
  return useQuery({
    queryKey: ['futures', symbol],
    queryFn: () => fetchFuturesData(symbol),
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

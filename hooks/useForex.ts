import { useQuery } from '@tanstack/react-query';

const fetchForexPair = async (from: string, to: string) => {
  const response = await fetch(`/api/market?endpoint=/v1/conversion/${from}/${to}`);
  if (!response.ok) throw new Error('Failed to fetch forex data');
  return response.json();
};

export const useForexPair = (from: string, to: string) => {
  return useQuery({
    queryKey: ['forex', from, to],
    queryFn: () => fetchForexPair(from, to),
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

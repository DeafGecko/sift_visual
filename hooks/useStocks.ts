import { useQuery } from '@tanstack/react-query';

const STOCKS = [
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN',
  'META', 'GOOGL', 'AMD', 'NFLX', 'PYPL',
  'BA', 'DIS', 'INTC', 'WMT', 'JPM',
  'XOM', 'PFE', 'KO', 'NKE', 'UBER',
  'COIN', 'SNAP', 'SPOT', 'RBLX', 'PLTR',
];

const fetchAllStocks = async () => {
  const results = await Promise.all(
    STOCKS.map(async (symbol) => {
      try {
        const res = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
        const data = await res.json();
        const result = data?.results?.[0];
        if (!result) return null;
        const changePerc = ((result.c - result.o) / result.o * 100);
        return {
          ticker: symbol,
          todaysChangePerc: changePerc,
          day: { c: result.c },
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter(Boolean);
};

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useAllStocks = () => {
  return useQuery({
    queryKey: ['allStocks'],
    queryFn: fetchAllStocks,
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useTopGainers = () => {
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: async () => {
      const stocks = await fetchAllStocks();
      return {
        tickers: [...stocks]
          .filter((s) => s!.todaysChangePerc > 0)
          .sort((a, b) => b!.todaysChangePerc - a!.todaysChangePerc)
          .slice(0, 5),
      };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useTopLosers = () => {
  return useQuery({
    queryKey: ['topLosers'],
    queryFn: async () => {
      const stocks = await fetchAllStocks();
      return {
        tickers: [...stocks]
          .filter((s) => s!.todaysChangePerc < 0)
          .sort((a, b) => a!.todaysChangePerc - b!.todaysChangePerc)
          .slice(0, 5),
      };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

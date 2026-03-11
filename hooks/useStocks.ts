import { useQuery } from '@tanstack/react-query';

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

const STOCKS = [
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN',
  'META', 'GOOGL', 'AMD', 'NFLX', 'PYPL',
  'BA', 'DIS', 'INTC', 'WMT', 'JPM',
  'XOM', 'PFE', 'KO', 'NKE', 'UBER',
  'COIN', 'SNAP', 'SPOT', 'RBLX', 'PLTR',
];

// ONE shared fetch for all stocks
const useAllStocks = () => {
  return useQuery({
    queryKey: ['allStocks'],
    queryFn: async () => {
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
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

// Gainers — uses shared fetch, only positive changes
export const useTopGainers = () => {
  const { data: stocks, isLoading } = useAllStocks();
  const gainers = stocks
    ? [...stocks]
        .filter((s) => s!.todaysChangePerc > 0)
        .sort((a, b) => b!.todaysChangePerc - a!.todaysChangePerc)
        .slice(0, 5)
    : [];
  return { data: { tickers: gainers }, isLoading };
};

// Losers — uses shared fetch, only negative changes
export const useTopLosers = () => {
  const { data: stocks, isLoading } = useAllStocks();
  const losers = stocks
    ? [...stocks]
        .filter((s) => s!.todaysChangePerc < 0)
        .sort((a, b) => a!.todaysChangePerc - b!.todaysChangePerc)
        .slice(0, 5)
    : [];
  return { data: { tickers: losers }, isLoading };
};

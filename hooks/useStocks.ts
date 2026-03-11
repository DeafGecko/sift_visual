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
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

// Expanded stock list for better coverage of gainers AND losers
const STOCKS = [
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN',
  'META', 'GOOGL', 'AMD', 'NFLX', 'PYPL',
  'BA', 'DIS', 'INTC', 'WMT', 'JPM',
  'XOM', 'PFE', 'KO', 'NKE', 'UBER',
  'COIN', 'SNAP', 'SPOT', 'RBLX', 'PLTR',
];

const fetchMultipleStocks = async () => {
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

export const useTopGainers = () => {
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: async () => {
      const stocks = await fetchMultipleStocks();
      const gainers = stocks
        .filter((s) => s!.todaysChangePerc > 0)
        .sort((a, b) => b!.todaysChangePerc - a!.todaysChangePerc)
        .slice(0, 5);
      return { tickers: gainers };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useTopLosers = () => {
  return useQuery({
    queryKey: ['topLosers'],
    queryFn: async () => {
      const stocks = await fetchMultipleStocks();
      const losers = stocks
        .filter((s) => s!.todaysChangePerc < 0)
        .sort((a, b) => a!.todaysChangePerc - b!.todaysChangePerc)
        .slice(0, 5);
      return { tickers: losers };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

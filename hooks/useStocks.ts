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

// Popular stocks for gainers/losers simulation on free tier
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL', 'AMD', 'NFLX', 'PYPL'];

const fetchMultipleStocks = async () => {
  const results = await Promise.all(
    POPULAR_STOCKS.map(async (symbol) => {
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
    })
  );
  return results.filter(Boolean);
};

export const useTopGainers = () => {
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: async () => {
      const stocks = await fetchMultipleStocks();
      return {
        tickers: stocks
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
      const stocks = await fetchMultipleStocks();
      return {
        tickers: stocks
          .filter((s) => s!.todaysChangePerc < 0)
          .sort((a, b) => a!.todaysChangePerc - b!.todaysChangePerc)
          .slice(0, 5),
      };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

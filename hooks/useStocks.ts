import { useQuery } from '@tanstack/react-query';

const SYMBOLS = [
  'AAPL','MSFT','NVDA','TSLA','AMZN','META','GOOGL','AMD','NFLX','PYPL',
  'BA','DIS','UBER','NKE','COIN','JPM','PFE','WMT','KO','SNAP',
  'SPOT','RBLX','PLTR','INTC','XOM'
];

const fetchStock = async (symbol: string) => {
  const res = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStock(symbol),
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useAllStocks = () => {
  return useQuery({
    queryKey: ['allStocks'],
    queryFn: async () => {
      const results = [];
      for (const symbol of SYMBOLS) {
        try {
          const res = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`);
          const data = await res.json();
          if (data?.results?.[0]) {
            const r = data.results[0];
            results.push({
              ticker: symbol,
              todaysChangePerc: ((r.c - r.o) / r.o) * 100,
              day: { o: r.o, h: r.h, l: r.l, c: r.c, v: r.v },
            });
          }
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch {}
      }
      return results;
    },
    staleTime: 300000,
  });
};

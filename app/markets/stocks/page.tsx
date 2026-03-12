'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'PYPL', name: 'PayPal Holdings' },
  { symbol: 'BA', name: 'Boeing Co.' },
  { symbol: 'DIS', name: 'Walt Disney Co.' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' },
  { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'UBER', name: 'Uber Technologies' },
  { symbol: 'COIN', name: 'Coinbase Global' },
  { symbol: 'SNAP', name: 'Snap Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology' },
  { symbol: 'RBLX', name: 'Roblox Corp.' },
  { symbol: 'PLTR', name: 'Palantir Technologies' },
];

const StockRow = ({ symbol, name, index }: { symbol: string; name: string; index: number }) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const changePerc = result ? ((result.c - result.o) / result.o * 100) : 0;
  const isPositive = changePerc >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-foreground">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{symbol}</div>
            <div className="text-xs text-foreground/40">{name}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        {isLoading ? (
          <span className="text-foreground/30 text-sm animate-pulse">Loading...</span>
        ) : (
          <span className="text-sm font-medium text-foreground">
            ${result?.c?.toFixed(2) ?? 'N/A'}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {isLoading ? (
          <span className="text-foreground/30 text-sm animate-pulse">--</span>
        ) : (
          <span className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{changePerc.toFixed(2)}%
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-foreground/50">${result?.o?.toFixed(2) ?? '--'}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-emerald-500/70">${result?.h?.toFixed(2) ?? '--'}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-red-500/70">${result?.l?.toFixed(2) ?? '--'}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-foreground/50">
          {result?.v ? (result.v / 1_000_000).toFixed(1) + 'M' : '--'}
        </span>
      </td>
    </motion.tr>
  );
};

export default function StocksPage() {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const filtered = STOCKS.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Stocks</h1>
          <p className="text-foreground/40 text-sm mt-1">Real-time quotes for top stocks</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm font-medium transition-colors"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.8, ease: 'linear' }}
          >
            <RefreshCw size={14} />
          </motion.div>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="relative mb-6 mt-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-card border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-left text-xs font-semibold text-foreground/40 uppercase tracking-wider">Symbol</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">Change</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">Open</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">High</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">Low</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">Volume</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, index) => (
              <StockRow key={stock.symbol} symbol={stock.symbol} name={stock.name} index={index} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-foreground/30">
            No stocks found for "{search}"
          </div>
        )}
      </div>
      <p className="text-foreground/20 text-xs mt-4">
        Showing previous day close data · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

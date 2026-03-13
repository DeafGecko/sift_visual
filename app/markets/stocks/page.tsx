'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import { TrendingUp, TrendingDown, RefreshCw, Search, Star } from 'lucide-react';
import AccessibilityBar from '@/app/components/AccessibilityBar';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import EduTooltip from '@/app/components/EduTooltip';
import { useWatchlistStore } from '@/store/useWatchlistStore';

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
  { symbol: 'UBER', name: 'Uber Technologies' },
  { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'COIN', name: 'Coinbase Global' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' },
  { symbol: 'SNAP', name: 'Snap Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology' },
  { symbol: 'RBLX', name: 'Roblox Corp.' },
  { symbol: 'PLTR', name: 'Palantir Technologies' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'XOM', name: 'Exxon Mobil' },
];

const StockRow = ({ symbol, name, index }: { symbol: string; name: string; index: number }) => {
  const { data, isLoading } = useStockData(symbol);
  const router = useRouter();
  const { toggleWatchlist, isWatched } = useWatchlistStore();
  const watched = isWatched(symbol);
  const result = data?.results?.[0];
  const changePerc = result ? ((result.c - result.o) / result.o * 100) : 0;
  const isPositive = changePerc >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(symbol); }}
            className={`transition-colors ${watched ? 'text-amber-400' : 'text-foreground/20 hover:text-amber-400'}`}
          >
            <Star size={15} fill={watched ? 'currentColor' : 'none'} />
          </button>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/markets/stocks/${symbol}`)}
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-foreground">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{symbol}</div>
              <div className="text-xs text-foreground/40">{name}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-right font-medium text-sm cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {isLoading ? <span className="text-foreground/30 animate-pulse">--</span> : (
          result?.c ? `$${result.c.toFixed(2)}` : <span className="text-foreground/30">N/A</span>
        )}
      </td>
      <td className="py-3 px-4 text-right cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {isLoading ? <span className="text-foreground/30 animate-pulse">--</span> : (
          <span className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{changePerc.toFixed(2)}%
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right text-sm text-foreground/60 cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {result?.o ? `$${result.o.toFixed(2)}` : <span className="text-foreground/30">$--</span>}
      </td>
      <td className="py-3 px-4 text-right text-sm text-emerald-500/80 cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {result?.h ? `$${result.h.toFixed(2)}` : <span className="text-foreground/30">$--</span>}
      </td>
      <td className="py-3 px-4 text-right text-sm text-red-500/80 cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {result?.l ? `$${result.l.toFixed(2)}` : <span className="text-foreground/30">$--</span>}
      </td>
      <td className="py-3 px-4 text-right text-sm text-foreground/50 cursor-pointer" onClick={() => router.push(`/markets/stocks/${symbol}`)}>
        {result?.v ? `${(result.v / 1_000_000).toFixed(1)}M` : <span className="text-foreground/30">--</span>}
      </td>
    </motion.tr>
  );
};

export default function StocksPage() {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const filtered = STOCKS.filter(
    (s) => s.symbol.toLowerCase().includes(search.toLowerCase()) ||
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
          <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8, ease: 'linear' }}>
            <RefreshCw size={14} />
          </motion.div>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <AccessibilityBar />
      </div>

      <div className="relative mt-4 mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-card border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-left text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Symbol">Symbol</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Price">Price</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Change">Change</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Open">Open</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="High">High</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Low">Low</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Volume">Volume</EduTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, index) => (
              <StockRow key={stock.symbol} symbol={stock.symbol} name={stock.name} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        ⭐ Star any stock to add to watchlist · Click row to view chart · Hover headers for definitions
      </p>
    </motion.div>
  );
}

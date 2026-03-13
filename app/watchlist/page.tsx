'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { useStockData } from '@/hooks/useStocks';
import { TrendingUp, TrendingDown, Star, Trash2, RefreshCw, StarOff, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STOCK_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.', MSFT: 'Microsoft Corp.', NVDA: 'NVIDIA Corp.',
  TSLA: 'Tesla Inc.', AMZN: 'Amazon.com Inc.', META: 'Meta Platforms',
  GOOGL: 'Alphabet Inc.', AMD: 'Advanced Micro Devices', NFLX: 'Netflix Inc.',
  PYPL: 'PayPal Holdings', BA: 'Boeing Co.', DIS: 'Walt Disney Co.',
  UBER: 'Uber Technologies', NKE: 'Nike Inc.', COIN: 'Coinbase Global',
  JPM: 'JPMorgan Chase', PFE: 'Pfizer Inc.', WMT: 'Walmart Inc.',
  KO: 'Coca-Cola Co.', SNAP: 'Snap Inc.', SPOT: 'Spotify Technology',
  RBLX: 'Roblox Corp.', PLTR: 'Palantir Technologies', INTC: 'Intel Corp.',
  XOM: 'Exxon Mobil',
};

const WatchlistRow = ({ symbol, index }: { symbol: string; index: number }) => {
  const { data, isLoading } = useStockData(symbol);
  const { removeFromWatchlist } = useWatchlistStore();
  const router = useRouter();
  const result = data?.results?.[0];
  const change = result ? ((result.c - result.o) / result.o) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold">{symbol}</div>
            <div className="text-xs text-foreground/40">{STOCK_NAMES[symbol] ?? symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        {isLoading ? (
          <span className="text-foreground/30 animate-pulse">--</span>
        ) : (
          <span className="text-sm font-semibold">
            ${result?.c?.toFixed(2) ?? 'N/A'}
          </span>
        )}
      </td>
      <td className="py-4 px-4 text-right">
        {isLoading ? (
          <span className="text-foreground/30 animate-pulse">--</span>
        ) : (
          <span className={`text-sm font-semibold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </td>
      <td className="py-4 px-4 text-right text-sm text-foreground/50">
        {result?.o?.toFixed(2) ? `$${result.o.toFixed(2)}` : '--'}
      </td>
      <td className="py-4 px-4 text-right text-sm text-emerald-500/70">
        {result?.h?.toFixed(2) ? `$${result.h.toFixed(2)}` : '--'}
      </td>
      <td className="py-4 px-4 text-right text-sm text-red-500/70">
        {result?.l?.toFixed(2) ? `$${result.l.toFixed(2)}` : '--'}
      </td>
      <td className="py-4 px-4 text-right text-sm text-foreground/50">
        {result?.v ? `${(result.v / 1_000_000).toFixed(1)}M` : '--'}
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => router.push(`/markets/stocks/${symbol}`)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors"
            title="View Chart"
          >
            <ExternalLink size={13} />
          </button>
          <button
            onClick={() => removeFromWatchlist(symbol)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
            title="Remove from Watchlist"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const EmptyState = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
        <Star size={28} className="text-amber-500/60" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Your watchlist is empty</h3>
      <p className="text-sm text-foreground/40 max-w-xs mb-6">
        Add stocks by clicking the ⭐ star icon on any stock in the Stocks page or Stock Detail page.
      </p>
      <button
        onClick={() => router.push('/markets/stocks')}
        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-background text-sm font-semibold rounded-xl transition-colors"
      >
        Browse Stocks
      </button>
    </motion.div>
  );
};

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useWatchlistStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleClear = () => {
    if (showClearConfirm) {
      clearWatchlist();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Star size={20} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Watchlist</h1>
            <p className="text-foreground/40 text-sm mt-0.5">
              {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {watchlist.length > 0 && (
            <button
              onClick={handleClear}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                showClearConfirm
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-card border-white/5 text-foreground/50 hover:text-foreground hover:bg-white/10'
              }`}
            >
              <StarOff size={14} />
              {showClearConfirm ? 'Tap again to confirm' : 'Clear All'}
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm font-medium border border-white/5 transition-colors"
          >
            <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8 }}>
              <RefreshCw size={14} />
            </motion.div>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Watching', value: watchlist.length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Gainers', value: '...', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Losers', value: '...', color: 'text-red-500', bg: 'bg-red-500/10' },
            ].map((card) => (
              <div key={card.label} className={`${card.bg} rounded-xl px-5 py-4 border border-white/5`}>
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-xs text-foreground/40 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Symbol', 'Price', 'Change', 'Open', 'High', 'Low', 'Volume', ''].map((h) => (
                    <th
                      key={h}
                      className={`py-3 px-4 text-xs font-semibold text-foreground/40 uppercase tracking-wider ${h === 'Symbol' ? 'text-left' : 'text-right'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {watchlist.map((symbol, index) => (
                    <WatchlistRow key={symbol} symbol={symbol} index={index} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <p className="text-foreground/20 text-xs mt-4">
            Hover any row to remove · Click ↗ to view chart · Saved to your browser
          </p>
        </>
      )}
    </motion.div>
  );
}

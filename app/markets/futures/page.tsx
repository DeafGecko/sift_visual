'use client';
import { motion } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AccessibilityBar from '@/app/components/AccessibilityBar';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import EduTooltip from '@/app/components/EduTooltip';

const FUTURES = [
  { symbol: 'SPY', name: 'S&P 500 Futures', category: 'Equity' },
  { symbol: 'QQQ', name: 'NASDAQ Futures', category: 'Equity' },
  { symbol: 'DIA', name: 'Dow Jones Futures', category: 'Equity' },
  { symbol: 'IWM', name: 'Russell 2000 Futures', category: 'Equity' },
  { symbol: 'GLD', name: 'Gold Futures', category: 'Commodities' },
  { symbol: 'SLV', name: 'Silver Futures', category: 'Commodities' },
  { symbol: 'USO', name: 'Crude Oil Futures', category: 'Commodities' },
  { symbol: 'UNG', name: 'Natural Gas Futures', category: 'Commodities' },
  { symbol: 'WEAT', name: 'Wheat Futures', category: 'Commodities' },
  { symbol: 'CORN', name: 'Corn Futures', category: 'Commodities' },
  { symbol: 'TLT', name: '20Y Treasury Bond', category: 'Bonds' },
  { symbol: 'IEF', name: '10Y Treasury Bond', category: 'Bonds' },
  { symbol: 'SHY', name: '1-3Y Treasury Bond', category: 'Bonds' },
];

const categories = ['All', 'Equity', 'Commodities', 'Bonds'];

const FuturesRow = ({ symbol, name, category, index }: { symbol: string; name: string; category: string; index: number }) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const changePerc = result ? ((result.c - result.o) / result.o * 100) : 0;
  const isPositive = changePerc >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-foreground">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{name}</div>
            <div className="text-xs text-foreground/40">{symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/50">{category}</span>
      </td>
      <td className="py-3 px-4 text-right">
        {isLoading ? <span className="text-foreground/30 text-sm animate-pulse">Loading...</span> : (
          <span className="text-sm font-medium text-foreground">${result?.c?.toFixed(2) ?? 'N/A'}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {isLoading ? <span className="text-foreground/30 text-sm animate-pulse">--</span> : (
          <span className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{changePerc.toFixed(2)}%
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right"><span className="text-sm text-foreground/50">${result?.o?.toFixed(2) ?? '--'}</span></td>
      <td className="py-3 px-4 text-right"><span className="text-sm text-emerald-500/70">${result?.h?.toFixed(2) ?? '--'}</span></td>
      <td className="py-3 px-4 text-right"><span className="text-sm text-red-500/70">${result?.l?.toFixed(2) ?? '--'}</span></td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-foreground/50">
          {result?.v ? (result.v / 1_000_000).toFixed(1) + 'M' : '--'}
        </span>
      </td>
    </motion.tr>
  );
};

export default function FuturesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const queryClient = useQueryClient();

  const filtered = FUTURES.filter((f) => activeCategory === 'All' || f.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Futures</h1>
          <p className="text-foreground/40 text-sm mt-1">Equity, Commodities and Bond futures</p>
        </div>
        <AccessibilityBar />
      </div>

      <div className="flex gap-2 mt-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat ? 'bg-emerald-500 text-background' : 'bg-card text-foreground/50 hover:text-foreground hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-left text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Contract">Contract</EduTooltip>
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Type">Type</EduTooltip>
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
            {filtered.map((future, index) => (
              <FuturesRow key={future.symbol} symbol={future.symbol} name={future.name} category={future.category} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Using ETF proxies for futures data · Hover column headers for definitions · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

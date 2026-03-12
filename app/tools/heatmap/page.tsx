'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAllStocks } from '@/hooks/useStocks';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const STOCK_INFO: Record<string, { name: string; sector: string }> = {
  AAPL: { name: 'Apple', sector: 'Technology' },
  MSFT: { name: 'Microsoft', sector: 'Technology' },
  NVDA: { name: 'NVIDIA', sector: 'Technology' },
  GOOGL: { name: 'Alphabet', sector: 'Technology' },
  META: { name: 'Meta', sector: 'Technology' },
  AMD: { name: 'AMD', sector: 'Technology' },
  INTC: { name: 'Intel', sector: 'Technology' },
  TSLA: { name: 'Tesla', sector: 'Consumer' },
  AMZN: { name: 'Amazon', sector: 'Consumer' },
  NFLX: { name: 'Netflix', sector: 'Consumer' },
  NKE: { name: 'Nike', sector: 'Consumer' },
  DIS: { name: 'Disney', sector: 'Consumer' },
  UBER: { name: 'Uber', sector: 'Consumer' },
  JPM: { name: 'JPMorgan', sector: 'Finance' },
  PYPL: { name: 'PayPal', sector: 'Finance' },
  COIN: { name: 'Coinbase', sector: 'Finance' },
  XOM: { name: 'Exxon', sector: 'Energy' },
  USO: { name: 'Crude Oil', sector: 'Energy' },
  PFE: { name: 'Pfizer', sector: 'Healthcare' },
  WMT: { name: 'Walmart', sector: 'Retail' },
  KO: { name: 'Coca-Cola', sector: 'Retail' },
  SNAP: { name: 'Snap', sector: 'Social' },
  SPOT: { name: 'Spotify', sector: 'Social' },
  RBLX: { name: 'Roblox', sector: 'Social' },
  PLTR: { name: 'Palantir', sector: 'Technology' },
  BA: { name: 'Boeing', sector: 'Industrial' },
};

const SECTORS = ['All', 'Technology', 'Consumer', 'Finance', 'Energy', 'Healthcare', 'Retail', 'Social', 'Industrial'];

const getColor = (change: number) => {
  if (change > 3) return '#065f46';
  if (change > 2) return '#047857';
  if (change > 1) return '#059669';
  if (change > 0) return '#10b981';
  if (change > -1) return '#ef4444';
  if (change > -2) return '#dc2626';
  if (change > -3) return '#b91c1c';
  return '#7f1d1d';
};

const getTextColor = (change: number) => {
  return Math.abs(change) > 0.5 ? '#ffffff' : '#ffffffaa';
};

export default function HeatMapPage() {
  const { data: stocks, isLoading, refetch } = useAllStocks();
  const [activeSector, setActiveSector] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStock, setHoveredStock] = useState<any>(null);
  const queryClient = useQueryClient();

  const filtered = stocks
    ? stocks.filter((s) => {
        const info = STOCK_INFO[s!.ticker];
        if (!info) return false;
        if (activeSector === 'All') return true;
        return info.sector === activeSector;
      })
    : [];

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
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Heat Map</h1>
          <p className="text-foreground/40 text-sm mt-1">
            Visual market performance overview
          </p>
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

      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 mt-2">
        <span className="text-xs text-foreground/40">Change:</span>
        {[
          { color: '#065f46', label: '>3%' },
          { color: '#10b981', label: '>0%' },
          { color: '#ef4444', label: '<0%' },
          { color: '#7f1d1d', label: '<-3%' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-foreground/50">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Sector Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeSector === sector
                ? 'bg-emerald-500 text-background'
                : 'bg-card text-foreground/50 hover:text-foreground hover:bg-white/10'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Heat Map Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-foreground/40 animate-pulse">Loading market data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          {filtered.map((stock, index) => {
            if (!stock) return null;
            const info = STOCK_INFO[stock.ticker];
            if (!info) return null;
            const change = stock.todaysChangePerc;
            const bgColor = getColor(change);
            const textColor = getTextColor(change);

            return (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onHoverStart={() => setHoveredStock(stock)}
                onHoverEnd={() => setHoveredStock(null)}
                className="relative rounded-xl p-3 cursor-pointer flex flex-col justify-between"
                style={{
                  backgroundColor: bgColor,
                  minHeight: '80px',
                }}
              >
                <div>
                  <div className="text-xs font-bold" style={{ color: textColor }}>
                    {stock.ticker}
                  </div>
                  <div className="text-xs opacity-70" style={{ color: textColor }}>
                    {info.name}
                  </div>
                </div>
                <div
                  className="text-sm font-bold mt-2"
                  style={{ color: textColor }}
                >
                  {change > 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
                <div className="text-xs opacity-60" style={{ color: textColor }}>
                  ${stock.day.c.toFixed(2)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredStock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-white/10 rounded-xl px-6 py-3 shadow-xl z-50 flex items-center gap-6"
        >
          <div>
            <div className="text-sm font-bold">{hoveredStock.ticker}</div>
            <div className="text-xs text-foreground/40">{STOCK_INFO[hoveredStock.ticker]?.name}</div>
          </div>
          <div className="text-sm font-medium">${hoveredStock.day.c.toFixed(2)}</div>
          <div className={`text-sm font-bold ${hoveredStock.todaysChangePerc > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {hoveredStock.todaysChangePerc > 0 ? '+' : ''}{hoveredStock.todaysChangePerc.toFixed(2)}%
          </div>
          <div className="text-xs text-foreground/40">{STOCK_INFO[hoveredStock.ticker]?.sector}</div>
        </motion.div>
      )}

      <p className="text-foreground/20 text-xs mt-6">
        Hover over any tile for details · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

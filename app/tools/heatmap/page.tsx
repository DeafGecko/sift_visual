'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import { RefreshCw } from 'lucide-react';
import AccessibilityBar from '@/app/components/AccessibilityBar';
import { useQueryClient } from '@tanstack/react-query';

const STOCKS: Record<string, { name: string; sector: string }> = {
  AAPL: { name: 'Apple', sector: 'Technology' },
  MSFT: { name: 'Microsoft', sector: 'Technology' },
  NVDA: { name: 'NVIDIA', sector: 'Technology' },
  GOOGL: { name: 'Alphabet', sector: 'Technology' },
  META: { name: 'Meta', sector: 'Technology' },
  AMD: { name: 'AMD', sector: 'Technology' },
  INTC: { name: 'Intel', sector: 'Technology' },
  PLTR: { name: 'Palantir', sector: 'Technology' },
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
  PFE: { name: 'Pfizer', sector: 'Healthcare' },
  WMT: { name: 'Walmart', sector: 'Retail' },
  KO: { name: 'Coca-Cola', sector: 'Retail' },
  SNAP: { name: 'Snap', sector: 'Social' },
  SPOT: { name: 'Spotify', sector: 'Social' },
  RBLX: { name: 'Roblox', sector: 'Social' },
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

const HeatTile = ({ symbol, info, index, activeSector, onHover }: {
  symbol: string;
  info: { name: string; sector: string };
  index: number;
  activeSector: string;
  onHover: (data: any) => void;
}) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const change = result ? ((result.c - result.o) / result.o) * 100 : 0;

  if (activeSector !== 'All' && info.sector !== activeSector) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onHoverStart={() => result && onHover({ symbol, info, change, result })}
      onHoverEnd={() => onHover(null)}
      className="relative rounded-xl p-3 cursor-pointer flex flex-col justify-between"
      style={{
        backgroundColor: isLoading ? '#27272a' : getColor(change),
        minHeight: '80px',
      }}
    >
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-3 w-12 bg-white/10 rounded mb-2" />
          <div className="h-2 w-16 bg-white/10 rounded" />
        </div>
      ) : (
        <>
          <div>
            <div className="text-xs font-bold text-white">{symbol}</div>
            <div className="text-xs text-white/70">{info.name}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
            <div className="text-xs text-white/60">${result?.c?.toFixed(2)}</div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default function HeatMapPage() {
  const [activeSector, setActiveSector] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStock, setHoveredStock] = useState<any>(null);
  const queryClient = useQueryClient();

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
          <h1 className="text-3xl font-bold">Heat Map</h1>
          <p className="text-foreground/40 text-sm mt-1">Visual market performance overview</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm font-medium transition-colors"
        >
          <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8 }}>
            <RefreshCw size={14} />
          </motion.div>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <AccessibilityBar />
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

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
        {Object.entries(STOCKS).map(([symbol, info], index) => (
          <HeatTile
            key={symbol}
            symbol={symbol}
            info={info}
            index={index}
            activeSector={activeSector}
            onHover={setHoveredStock}
          />
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredStock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-white/10 rounded-xl px-6 py-3 shadow-xl z-50 flex items-center gap-6"
        >
          <div>
            <div className="text-sm font-bold">{hoveredStock.symbol}</div>
            <div className="text-xs text-foreground/40">{hoveredStock.info.name}</div>
          </div>
          <div className="text-sm font-medium">${hoveredStock.result?.c?.toFixed(2)}</div>
          <div className={`text-sm font-bold ${hoveredStock.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {hoveredStock.change >= 0 ? '+' : ''}{hoveredStock.change.toFixed(2)}%
          </div>
          <div className="text-xs text-foreground/40">{hoveredStock.info.sector}</div>
        </motion.div>
      )}

      <p className="text-foreground/20 text-xs mt-6">
        Hover over any tile for details · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

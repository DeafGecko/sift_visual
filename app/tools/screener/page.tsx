'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import { RefreshCw, TrendingUp, TrendingDown, Search, SlidersHorizontal } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const STOCKS: Record<string, { name: string; sector: string; marketCap: string }> = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', marketCap: 'Mega' },
  MSFT: { name: 'Microsoft Corp.', sector: 'Technology', marketCap: 'Mega' },
  NVDA: { name: 'NVIDIA Corp.', sector: 'Technology', marketCap: 'Mega' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', marketCap: 'Mega' },
  META: { name: 'Meta Platforms', sector: 'Technology', marketCap: 'Mega' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Technology', marketCap: 'Large' },
  INTC: { name: 'Intel Corp.', sector: 'Technology', marketCap: 'Large' },
  PLTR: { name: 'Palantir Technologies', sector: 'Technology', marketCap: 'Mid' },
  TSLA: { name: 'Tesla Inc.', sector: 'Consumer', marketCap: 'Mega' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer', marketCap: 'Mega' },
  NFLX: { name: 'Netflix Inc.', sector: 'Consumer', marketCap: 'Large' },
  NKE: { name: 'Nike Inc.', sector: 'Consumer', marketCap: 'Large' },
  DIS: { name: 'Walt Disney Co.', sector: 'Consumer', marketCap: 'Large' },
  UBER: { name: 'Uber Technologies', sector: 'Consumer', marketCap: 'Large' },
  JPM: { name: 'JPMorgan Chase', sector: 'Finance', marketCap: 'Mega' },
  PYPL: { name: 'PayPal Holdings', sector: 'Finance', marketCap: 'Large' },
  COIN: { name: 'Coinbase Global', sector: 'Finance', marketCap: 'Mid' },
  XOM: { name: 'Exxon Mobil', sector: 'Energy', marketCap: 'Mega' },
  PFE: { name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 'Large' },
  WMT: { name: 'Walmart Inc.', sector: 'Retail', marketCap: 'Mega' },
  KO: { name: 'Coca-Cola Co.', sector: 'Retail', marketCap: 'Large' },
  SNAP: { name: 'Snap Inc.', sector: 'Social', marketCap: 'Mid' },
  SPOT: { name: 'Spotify Technology', sector: 'Social', marketCap: 'Mid' },
  RBLX: { name: 'Roblox Corp.', sector: 'Social', marketCap: 'Mid' },
  BA: { name: 'Boeing Co.', sector: 'Industrial', marketCap: 'Large' },
};

const SECTORS = ['All', 'Technology', 'Consumer', 'Finance', 'Energy', 'Healthcare', 'Retail', 'Social', 'Industrial'];
const MARKET_CAPS = ['All', 'Mega', 'Large', 'Mid'];

type SortKey = 'symbol' | 'price' | 'change' | 'volume' | 'high' | 'low';
type SortDir = 'asc' | 'desc';

const StockRow = ({ symbol, info, index, onClick }: {
  symbol: string;
  info: { name: string; sector: string; marketCap: string };
  index: number;
  onClick: () => void;
}) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const change = result ? ((result.c - result.o) / result.o) * 100 : 0;
  const isPositive = change >= 0;

  return {
    symbol, info, result, change, isPositive, isLoading,
    render: () => (
      <motion.tr
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        onClick={onClick}
        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="text-sm font-semibold">{symbol}</div>
              <div className="text-xs text-foreground/40">{info.name}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-center">
          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/50">{info.sector}</span>
        </td>
        <td className="py-3 px-4 text-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            info.marketCap === 'Mega' ? 'bg-emerald-500/10 text-emerald-500' :
            info.marketCap === 'Large' ? 'bg-blue-500/10 text-blue-400' :
            'bg-white/5 text-foreground/50'
          }`}>{info.marketCap}</span>
        </td>
        <td className="py-3 px-4 text-right">
          {isLoading ? <span className="text-foreground/30 animate-pulse text-sm">--</span> :
            <span className="text-sm font-medium">${result?.c?.toFixed(2) ?? 'N/A'}</span>}
        </td>
        <td className="py-3 px-4 text-right">
          {isLoading ? <span className="text-foreground/30 animate-pulse text-sm">--</span> : (
            <span className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
          )}
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
    )
  };
};

export default function ScreenerPage() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [marketCap, setMarketCap] = useState('All');
  const [minChange, setMinChange] = useState('');
  const [maxChange, setMaxChange] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const stockData: Record<string, any> = {};
  Object.keys(STOCKS).forEach((sym) => {
    const { data } = useStockData(sym);
    const r = data?.results?.[0];
    if (r) stockData[sym] = { ...r, change: ((r.c - r.o) / r.o) * 100 };
  });

  const filtered = useMemo(() => {
    return Object.entries(STOCKS)
      .filter(([sym, info]) => {
        const matchSearch = sym.toLowerCase().includes(search.toLowerCase()) ||
          info.name.toLowerCase().includes(search.toLowerCase());
        const matchSector = sector === 'All' || info.sector === sector;
        const matchCap = marketCap === 'All' || info.marketCap === marketCap;
        const d = stockData[sym];
        const matchMin = minChange === '' || (d && d.change >= parseFloat(minChange));
        const matchMax = maxChange === '' || (d && d.change <= parseFloat(maxChange));
        return matchSearch && matchSector && matchCap && matchMin && matchMax;
      })
      .sort(([symA, infoA], [symB, infoB]) => {
        const dA = stockData[symA];
        const dB = stockData[symB];
        let valA: any = symA;
        let valB: any = symB;
        if (sortKey === 'price') { valA = dA?.c ?? 0; valB = dB?.c ?? 0; }
        if (sortKey === 'change') { valA = dA?.change ?? 0; valB = dB?.change ?? 0; }
        if (sortKey === 'volume') { valA = dA?.v ?? 0; valB = dB?.v ?? 0; }
        if (sortKey === 'high') { valA = dA?.h ?? 0; valB = dB?.h ?? 0; }
        if (sortKey === 'low') { valA = dA?.l ?? 0; valB = dB?.l ?? 0; }
        return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
  }, [search, sector, marketCap, minChange, maxChange, sortKey, sortDir, stockData]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
      onClick={() => handleSort(k)}
    >
      {label} {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Screener</h1>
          <p className="text-foreground/40 text-sm mt-1">Filter and sort stocks by criteria</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-emerald-500 text-background' : 'bg-card text-foreground/70 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 text-sm font-medium transition-colors"
          >
            <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8 }}>
              <RefreshCw size={14} />
            </motion.div>
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
        <input
          type="text"
          placeholder="Search by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card rounded-xl border border-white/5 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="text-xs text-foreground/40 uppercase tracking-wider mb-2 block">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500/50"
            >
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-foreground/40 uppercase tracking-wider mb-2 block">Market Cap</label>
            <select
              value={marketCap}
              onChange={(e) => setMarketCap(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500/50"
            >
              {MARKET_CAPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-foreground/40 uppercase tracking-wider mb-2 block">Min Change %</label>
            <input
              type="number"
              placeholder="e.g. -5"
              value={minChange}
              onChange={(e) => setMinChange(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="text-xs text-foreground/40 uppercase tracking-wider mb-2 block">Max Change %</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={maxChange}
              onChange={(e) => setMaxChange(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </motion.div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-foreground/40">{filtered.length} results</span>
        {(sector !== 'All' || marketCap !== 'All' || minChange || maxChange || search) && (
          <button
            onClick={() => { setSector('All'); setMarketCap('All'); setMinChange(''); setMaxChange(''); setSearch(''); }}
            className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-left text-xs font-semibold text-foreground/40 uppercase tracking-wider">Symbol</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-foreground/40 uppercase tracking-wider">Sector</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-foreground/40 uppercase tracking-wider">Cap</th>
              <SortHeader label="Price" k="price" />
              <SortHeader label="Change" k="change" />
              <SortHeader label="High" k="high" />
              <SortHeader label="Low" k="low" />
              <SortHeader label="Volume" k="volume" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(([symbol, info], index) => {
              const { data } = useStockData(symbol);
              const r = data?.results?.[0];
              const change = r ? ((r.c - r.o) / r.o) * 100 : 0;
              const isPositive = change >= 0;
              return (
                <motion.tr
                  key={symbol}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => router.push(`/markets/stocks/${symbol}`)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">
                        {symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{symbol}</div>
                        <div className="text-xs text-foreground/40">{info.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/50">{info.sector}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      info.marketCap === 'Mega' ? 'bg-emerald-500/10 text-emerald-500' :
                      info.marketCap === 'Large' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-white/5 text-foreground/50'
                    }`}>{info.marketCap}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium">${r?.c?.toFixed(2) ?? '--'}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-emerald-500/70">${r?.h?.toFixed(2) ?? '--'}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-red-500/70">${r?.l?.toFixed(2) ?? '--'}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-foreground/50">{r?.v ? (r.v / 1_000_000).toFixed(1) + 'M' : '--'}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Click any row to view stock detail · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

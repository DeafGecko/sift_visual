'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockData } from '@/hooks/useStocks';
import AccessibilityBar from '@/app/components/AccessibilityBar';
import { useEffect, useState } from 'react';

const STOCKS: Record<string, { name: string; sector: string; baseVolume: number }> = {
  AAPL:  { name: 'Apple',      sector: 'Technology', baseVolume: 9 },
  MSFT:  { name: 'Microsoft',  sector: 'Technology', baseVolume: 8 },
  NVDA:  { name: 'NVIDIA',     sector: 'Technology', baseVolume: 9 },
  GOOGL: { name: 'Alphabet',   sector: 'Technology', baseVolume: 7 },
  META:  { name: 'Meta',       sector: 'Technology', baseVolume: 7 },
  TSLA:  { name: 'Tesla',      sector: 'Consumer',   baseVolume: 9 },
  AMZN:  { name: 'Amazon',     sector: 'Consumer',   baseVolume: 8 },
  AMD:   { name: 'AMD',        sector: 'Technology', baseVolume: 8 },
  NFLX:  { name: 'Netflix',    sector: 'Consumer',   baseVolume: 5 },
  JPM:   { name: 'JPMorgan',   sector: 'Finance',    baseVolume: 6 },
  COIN:  { name: 'Coinbase',   sector: 'Finance',    baseVolume: 7 },
  PYPL:  { name: 'PayPal',     sector: 'Finance',    baseVolume: 5 },
  UBER:  { name: 'Uber',       sector: 'Consumer',   baseVolume: 6 },
  NKE:   { name: 'Nike',       sector: 'Consumer',   baseVolume: 4 },
  DIS:   { name: 'Disney',     sector: 'Consumer',   baseVolume: 5 },
  PLTR:  { name: 'Palantir',   sector: 'Technology', baseVolume: 7 },
  INTC:  { name: 'Intel',      sector: 'Technology', baseVolume: 6 },
  XOM:   { name: 'Exxon',      sector: 'Energy',     baseVolume: 5 },
  PFE:   { name: 'Pfizer',     sector: 'Healthcare', baseVolume: 5 },
  WMT:   { name: 'Walmart',    sector: 'Retail',     baseVolume: 4 },
  KO:    { name: 'Coca-Cola',  sector: 'Retail',     baseVolume: 4 },
  SNAP:  { name: 'Snap',       sector: 'Social',     baseVolume: 6 },
  SPOT:  { name: 'Spotify',    sector: 'Social',     baseVolume: 4 },
  RBLX:  { name: 'Roblox',     sector: 'Social',     baseVolume: 5 },
  BA:    { name: 'Boeing',     sector: 'Industrial', baseVolume: 4 },
};

const SECTORS = ['All', 'Technology', 'Consumer', 'Finance', 'Energy', 'Healthcare', 'Retail', 'Social', 'Industrial'];
const LOADING_MESSAGES = ['Fetching market data...', 'Loading stock prices...', 'Calculating volume...', 'Building bento layout...', 'Almost ready...'];
const TILE_COLORS = ['#065f46','#047857','#059669','#10b981','#ef4444','#dc2626','#b91c1c','#7f1d1d'];

const getColor = (change: number) => {
  if (change > 3)  return { bg: '#065f46', border: '#10b981' };
  if (change > 2)  return { bg: '#047857', border: '#10b981' };
  if (change > 1)  return { bg: '#059669', border: '#34d399' };
  if (change > 0)  return { bg: '#10b981', border: '#6ee7b7' };
  if (change > -1) return { bg: '#ef4444', border: '#fca5a5' };
  if (change > -2) return { bg: '#dc2626', border: '#f87171' };
  if (change > -3) return { bg: '#b91c1c', border: '#ef4444' };
  return           { bg: '#7f1d1d', border: '#dc2626' };
};

// Map volume tier (1-9) to CSS grid span
const getSpan = (vol: number, liveVol?: number): number => {
  const effective = liveVol ? Math.min(9, Math.max(1, Math.round(liveVol / 30_000_000))) : vol;
  if (effective >= 9) return 3;
  if (effective >= 7) return 2;
  return 1;
};

const BentoTile = ({ symbol, info, index, activeSector, onHover }: {
  symbol: string;
  info: { name: string; sector: string; baseVolume: number };
  index: number;
  activeSector: string;
  onHover: (data: any) => void;
}) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const change = result ? ((result.c - result.o) / result.o) * 100 : 0;
  const span = getSpan(info.baseVolume, result?.v);
  const colors = getColor(change);
  const isBig = span >= 2;

  if (activeSector !== 'All' && info.sector !== activeSector) return null;

  const gridStyle = {
    gridColumn: `span ${span}`,
    gridRow: span === 3 ? 'span 2' : 'span 1',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, type: 'spring', stiffness: 180, damping: 22 }}
      whileHover={{ scale: 1.03, zIndex: 20 }}
      onHoverStart={() => result && onHover({ symbol, info, change, result, span })}
      onHoverEnd={() => onHover(null)}
      style={{
        ...gridStyle,
        backgroundColor: isLoading ? '#1c1c1e' : colors.bg,
        borderColor: isLoading ? '#333' : `${colors.border}40`,
        minHeight: isBig ? '140px' : '90px',
      }}
      className="relative rounded-2xl p-4 cursor-pointer flex flex-col justify-between border overflow-hidden group"
    >
      {/* Background glow on big tiles */}
      {isBig && !isLoading && (
        <div
          className="absolute inset-0 opacity-10 rounded-2xl"
          style={{ background: `radial-gradient(circle at 30% 30%, ${colors.border}, transparent 70%)` }}
        />
      )}

      {isLoading ? (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col justify-between h-full"
        >
          <div className="h-3 w-14 bg-white/10 rounded" />
          <div className="h-2 w-20 bg-white/10 rounded mt-2" />
          {isBig && <div className="h-5 w-16 bg-white/10 rounded mt-auto" />}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between h-full relative z-10"
        >
          <div>
            <div className={`font-black text-white ${isBig ? 'text-base' : 'text-xs'}`}>{symbol}</div>
            {isBig && <div className="text-xs text-white/60 mt-0.5">{info.name}</div>}
            <div className="text-xs text-white/40 mt-0.5">{info.sector}</div>
          </div>
          <div className="mt-2">
            <div className={`font-black text-white ${span === 3 ? 'text-2xl' : isBig ? 'text-lg' : 'text-sm'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
            <div className={`text-white/60 ${isBig ? 'text-sm' : 'text-xs'}`}>${result?.c?.toFixed(2)}</div>
            {isBig && result?.v && (
              <div className="text-xs text-white/30 mt-1">
                Vol: {(result.v / 1_000_000).toFixed(1)}M
              </div>
            )}
          </div>
          {/* Volume bar at bottom */}
          {result?.v && (
            <div className="absolute bottom-2 right-2 flex flex-col items-end gap-0.5">
              <div className="flex gap-0.5">
                {Array.from({ length: span }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

function LoadingScreen({ msgIndex }: { msgIndex: number }) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-8 px-8"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-2xl border-2 border-emerald-500/20 border-t-emerald-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1 w-8 h-8">
            {[3,1,2,1].map((s, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="rounded-sm bg-emerald-500"
                style={{ gridColumn: `span ${s > 2 ? 2 : 1}`, opacity: 0.3 + i * 0.2 }}
              />
            ))}
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border border-emerald-500/20"
        />
      </div>

      <div className="text-center h-14 flex flex-col items-center justify-center gap-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-lg font-semibold text-foreground"
          >
            {LOADING_MESSAGES[msgIndex % LOADING_MESSAGES.length]}
          </motion.p>
        </AnimatePresence>
        <p className="text-sm text-foreground/30">Tile size reflects trading volume</p>
      </div>

      <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.8, ease: 'easeInOut' }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </div>

      {/* Ghost bento preview */}
      <div
        className="opacity-10"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 3rem)', gap: '0.375rem' }}
      >
        {Object.entries(STOCKS).slice(0, 18).map(([sym, info], i) => {
          const span = info.baseVolume >= 9 ? 3 : info.baseVolume >= 7 ? 2 : 1;
          return (
            <motion.div
              key={sym}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                gridColumn: `span ${span}`,
                height: span >= 2 ? '3.5rem' : '2rem',
                backgroundColor: TILE_COLORS[i % 8],
                borderRadius: '0.5rem',
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default function HeatMapPage() {
  const [activeSector, setActiveSector] = useState('All');
  const [hoveredStock, setHoveredStock] = useState<any>(null);
  const [pageReady, setPageReady] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex(i => i + 1), 700);
    const timer = setTimeout(() => { setPageReady(true); clearInterval(interval); }, 2800);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!pageReady ? (
        <LoadingScreen key="loading" msgIndex={msgIndex} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="p-8 min-h-screen bg-background text-foreground"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Heat Map</h1>
              <p className="text-foreground/40 text-sm mt-1">Tile size = trading volume · Color = daily change</p>
            </div>
            <AccessibilityBar />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <span className="text-xs text-foreground/40">Volume:</span>
              {[{ dots: 1, label: 'Low' }, { dots: 2, label: 'Mid' }, { dots: 3, label: 'High' }].map((v) => (
                <div key={v.label} className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: v.dots }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    ))}
                  </div>
                  <span className="text-xs text-foreground/40">{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {SECTORS.map((sector, i) => (
              <motion.button
                key={sector}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setActiveSector(sector)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeSector === sector
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-foreground/50 hover:text-foreground hover:bg-white/10 border border-white/5'
                }`}
              >
                {sector}
              </motion.button>
            ))}
          </div>

          {/* Bento Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.5rem',
              gridAutoRows: 'minmax(90px, auto)',
            }}
          >
            {Object.entries(STOCKS).map(([symbol, info], index) => (
              <BentoTile
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
          <AnimatePresence>
            {hoveredStock && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl z-50 flex items-center gap-6"
              >
                <div>
                  <div className="text-base font-black text-white">{hoveredStock.symbol}</div>
                  <div className="text-xs text-white/40">{hoveredStock.info.name}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-sm font-semibold text-white">${hoveredStock.result?.c?.toFixed(2)}</div>
                  <div className="text-xs text-white/40">Price</div>
                </div>
                <div>
                  <div className={`text-sm font-black ${hoveredStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hoveredStock.change >= 0 ? '+' : ''}{hoveredStock.change.toFixed(2)}%
                  </div>
                  <div className="text-xs text-white/40">Change</div>
                </div>
                {hoveredStock.result?.v && (
                  <div>
                    <div className="text-sm font-semibold text-white">{(hoveredStock.result.v / 1_000_000).toFixed(1)}M</div>
                    <div className="text-xs text-white/40">Volume</div>
                  </div>
                )}
                <div className="px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-xs text-white/50">{hoveredStock.info.sector}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-foreground/20 text-xs mt-6">
            Larger tiles = higher trading volume · Hover any tile for full details
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

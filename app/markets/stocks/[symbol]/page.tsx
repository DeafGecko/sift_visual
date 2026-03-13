'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Star } from 'lucide-react';
import { useStockData } from '@/hooks/useStocks';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import StockReader from '@/app/components/StockReader';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string).toUpperCase();
  const { data, isLoading, refetch } = useStockData(symbol);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toggleWatchlist, isWatched } = useWatchlistStore();
  const watched = isWatched(symbol);

  const result = data?.results?.[0];
  const changePerc = result ? ((result.c - result.o) / result.o * 100) : 0;
  const isPositive = changePerc >= 0;

  useEffect(() => {
    if (!symbol) return;
    const fetchHistory = async () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      const from = start.toISOString().split('T')[0];
      const to = end.toISOString().split('T')[0];
      const res = await fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}`);
      const data = await res.json();
      if (data?.results) {
        setHistoryData(data.results.map((r: any) => ({
          time: new Date(r.t).toISOString().split('T')[0],
          open: r.o, high: r.h, low: r.l, close: r.c,
        })));
      }
    };
    fetchHistory();
  }, [symbol]);

  useEffect(() => {
    if (!chartRef.current || historyData.length === 0) return;
    const initChart = async () => {
      const { createChart, CandlestickSeries } = await import('lightweight-charts');
      chartRef.current!.innerHTML = '';
      const chart = createChart(chartRef.current!, {
        width: chartRef.current!.clientWidth,
        height: 400,
        layout: { background: { color: '#18181b' }, textColor: '#fafafa' },
        grid: { vertLines: { color: '#ffffff10' }, horzLines: { color: '#ffffff10' } },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#ffffff10' },
        timeScale: { borderColor: '#ffffff10' },
      });
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981', downColor: '#ef4444',
        borderUpColor: '#10b981', borderDownColor: '#ef4444',
        wickUpColor: '#10b981', wickDownColor: '#ef4444',
      });
      candleSeries.setData(historyData);
      chart.timeScale().fitContent();
      setChartReady(true);
      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth });
      });
      resizeObserver.observe(chartRef.current!);
    };
    initChart();
  }, [historyData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
      role="main"
      aria-label={`${symbol} stock detail`}
    >
      {/* Back button */}
      <button
        onClick={() => router.push('/markets/stocks')}
        aria-label="Back to stocks list"
        className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Stocks
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold" aria-label={`${symbol} stock`}>{symbol}</h1>
            <button
              onClick={() => toggleWatchlist(symbol)}
              aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
              aria-pressed={watched}
              className={`transition-colors ${watched ? 'text-amber-400' : 'text-foreground/20 hover:text-amber-400'}`}
            >
              <Star size={22} fill={watched ? 'currentColor' : 'none'} />
            </button>
            {!isLoading && result && (
              <span
                aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(changePerc).toFixed(2)} percent today`}
                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? '+' : ''}{changePerc.toFixed(2)}%
              </span>
            )}
          </div>
          {!isLoading && result && (
            <p
              className="text-4xl font-bold text-foreground mt-2"
              aria-label={`Current price $${result?.c?.toFixed(2)}`}
            >
              ${result?.c?.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <StockReader
              symbol={symbol}
              price={result?.c}
              change={changePerc}
              open={result?.o}
              high={result?.h}
              low={result?.l}
              volume={result?.v}
            />
          )}
          <button
            onClick={handleRefresh}
            aria-label="Refresh stock data"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm transition-colors"
          >
            <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8 }}>
              <RefreshCw size={14} />
            </motion.div>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      {result && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          role="region"
          aria-label="Stock statistics"
        >
          {[
            { label: 'Open', value: `$${result.o?.toFixed(2)}`, ariaLabel: `Opening price $${result.o?.toFixed(2)}` },
            { label: 'High', value: `$${result.h?.toFixed(2)}`, color: 'text-emerald-500', ariaLabel: `Day high $${result.h?.toFixed(2)}` },
            { label: 'Low', value: `$${result.l?.toFixed(2)}`, color: 'text-red-500', ariaLabel: `Day low $${result.l?.toFixed(2)}` },
            { label: 'Volume', value: `${(result.v / 1_000_000).toFixed(1)}M`, ariaLabel: `Trading volume ${(result.v / 1_000_000).toFixed(1)} million shares` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-4 border border-white/5"
              aria-label={stat.ariaLabel}
            >
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-lg font-semibold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div
        className="bg-card rounded-xl border border-white/5 p-4"
        role="region"
        aria-label="6 month price history chart"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
            6 Month Price History
          </h2>
          {!chartReady && (
            <span role="status" aria-live="polite" className="text-xs text-foreground/30 animate-pulse">
              Loading chart...
            </span>
          )}
        </div>
        <div
          ref={chartRef}
          className="w-full"
          style={{ height: '400px' }}
          role="img"
          aria-label={`${symbol} candlestick price chart for the last 6 months`}
        />
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Previous day close data · Use Read Aloud button for audio summary · Press Tab to navigate
      </p>
    </motion.div>
  );
}

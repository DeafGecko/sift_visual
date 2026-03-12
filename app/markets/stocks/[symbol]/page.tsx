'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useStockData } from '@/hooks/useStocks';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string).toUpperCase();
  const { data, isLoading, refetch } = useStockData(symbol);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const result = data?.results?.[0];
  const changePerc = result ? ((result.c - result.o) / result.o * 100) : 0;
  const isPositive = changePerc >= 0;

  // Fetch historical data
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
          open: r.o,
          high: r.h,
          low: r.l,
          close: r.c,
        })));
      }
    };
    fetchHistory();
  }, [symbol]);

  // Build chart
  useEffect(() => {
    if (!chartRef.current || historyData.length === 0) return;

    const initChart = async () => {
      const { createChart } = await import('lightweight-charts');
      chartRef.current!.innerHTML = '';

      const chart = createChart(chartRef.current!, {
        width: chartRef.current!.clientWidth,
        height: 400,
        layout: {
          background: { color: '#18181b' },
          textColor: '#fafafa',
        },
        grid: {
          vertLines: { color: '#ffffff10' },
          horzLines: { color: '#ffffff10' },
        },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#ffffff10' },
        timeScale: { borderColor: '#ffffff10' },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      candleSeries.setData(historyData);
      chart.timeScale().fitContent();
      setChartReady(true);

      // Responsive resize
      const resizeObserver = new ResizeObserver(() => {
        chart.applyOptions({ width: chartRef.current!.clientWidth });
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
    >
      {/* Back button */}
      <button
        onClick={() => router.push('/markets/stocks')}
        className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Stocks
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold">{symbol}</h1>
            {!isLoading && result && (
              <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? '+' : ''}{changePerc.toFixed(2)}%
              </span>
            )}
          </div>
          {!isLoading && result && (
            <p className="text-4xl font-bold text-foreground mt-2">
              ${result?.c?.toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm transition-colors"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.8, ease: 'linear' }}
          >
            <RefreshCw size={14} />
          </motion.div>
          Refresh
        </button>
      </div>

      {/* Stats row */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open', value: `$${result.o?.toFixed(2)}` },
            { label: 'High', value: `$${result.h?.toFixed(2)}`, color: 'text-emerald-500' },
            { label: 'Low', value: `$${result.l?.toFixed(2)}`, color: 'text-red-500' },
            { label: 'Volume', value: `${(result.v / 1_000_000).toFixed(1)}M` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-white/5">
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-lg font-semibold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="bg-card rounded-xl border border-white/5 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
            6 Month Price History
          </h2>
          {!chartReady && (
            <span className="text-xs text-foreground/30 animate-pulse">Loading chart...</span>
          )}
        </div>
        <div ref={chartRef} className="w-full" />
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Previous day close data · Click any stock in the table to view details
      </p>
    </motion.div>
  );
}

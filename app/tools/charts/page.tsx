'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import AccessibilityBar from '@/app/components/AccessibilityBar';

const POPULAR = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL', 'AMD'];

const TIMEFRAMES = [
  { label: '1W', days: 7, multiplier: '1', timespan: 'hour' },
  { label: '1M', days: 30, multiplier: '1', timespan: 'day' },
  { label: '3M', days: 90, multiplier: '1', timespan: 'day' },
  { label: '6M', days: 180, multiplier: '1', timespan: 'day' },
  { label: '1Y', days: 365, multiplier: '1', timespan: 'day' },
];

type ChartType = 'candlestick' | 'line' | 'area';

export default function ChartsPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState('AAPL');
  const [inputVal, setInputVal] = useState('AAPL');
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[2]);
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [showMA, setShowMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState('');

  const loadChart = async () => {
    if (!chartRef.current) return;
    setIsLoading(true);
    setError('');

    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - timeframe.days);
      const from = start.toISOString().split('T')[0];
      const to = end.toISOString().split('T')[0];

      const [histRes, quoteRes] = await Promise.all([
        fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/range/${timeframe.multiplier}/${timeframe.timespan}/${from}/${to}`),
        fetch(`/api/market?endpoint=/v2/aggs/ticker/${symbol}/prev`),
      ]);

      const histData = await histRes.json();
      const quoteData = await quoteRes.json();

      if (quoteData?.results?.[0]) setQuote(quoteData.results[0]);

      if (!histData?.results?.length) {
        setError(`No data found for ${symbol}`);
        setIsLoading(false);
        return;
      }

      const { createChart, CandlestickSeries, LineSeries, AreaSeries, HistogramSeries } = await import('lightweight-charts');
      chartRef.current.innerHTML = '';

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 480,
        layout: { background: { color: '#18181b' }, textColor: '#fafafa' },
        grid: { vertLines: { color: '#ffffff08' }, horzLines: { color: '#ffffff08' } },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#ffffff10' },
        timeScale: { borderColor: '#ffffff10', timeVisible: true },
      });

      const candles = histData.results.map((r: any) => ({
        time: timeframe.timespan === 'hour'
          ? Math.floor(r.t / 1000) as any
          : new Date(r.t).toISOString().split('T')[0],
        open: r.o, high: r.h, low: r.l, close: r.c,
        value: r.c,
        color: r.c >= r.o ? '#10b98133' : '#ef444433',
      }));

      // Main price series
      if (chartType === 'candlestick') {
        const series = chart.addSeries(CandlestickSeries, {
          upColor: '#10b981', downColor: '#ef4444',
          borderUpColor: '#10b981', borderDownColor: '#ef4444',
          wickUpColor: '#10b981', wickDownColor: '#ef4444',
        });
        series.setData(candles);
      } else if (chartType === 'line') {
        const series = chart.addSeries(LineSeries, {
          color: '#10b981', lineWidth: 2,
        });
        series.setData(candles.map((c: any) => ({ time: c.time, value: c.close })));
      } else {
        const series = chart.addSeries(AreaSeries, {
          topColor: '#10b98133', bottomColor: '#10b98105',
          lineColor: '#10b981', lineWidth: 2,
        });
        series.setData(candles.map((c: any) => ({ time: c.time, value: c.close })));
      }

      // Moving Average
      if (showMA && candles.length >= 20) {
        const maSeries = chart.addSeries(LineSeries, {
          color: '#f59e0b', lineWidth: 1, title: 'MA20',
        });
        const maData = candles.slice(19).map((_: any, i: number) => {
          const slice = candles.slice(i, i + 20);
          const avg = slice.reduce((s: number, c: any) => s + c.close, 0) / 20;
          return { time: candles[i + 19].time, value: avg };
        });
        maSeries.setData(maData);
      }

      // Volume
      if (showVolume) {
        const volSeries = chart.addSeries(HistogramSeries, {
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });
        volSeries.setData(histData.results.map((r: any) => ({
          time: timeframe.timespan === 'hour'
            ? Math.floor(r.t / 1000) as any
            : new Date(r.t).toISOString().split('T')[0],
          value: r.v,
          color: r.c >= r.o ? '#10b98133' : '#ef444433',
        })));
      }

      chart.timeScale().fitContent();

      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth });
      });
      resizeObserver.observe(chartRef.current);

    } catch (e) {
      setError('Failed to load chart data');
    }

    setIsLoading(false);
  };

  useEffect(() => { loadChart(); }, [symbol, timeframe, chartType, showMA, showVolume]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputVal.trim().toUpperCase();
    if (val) setSymbol(val);
  };

  const change = quote ? ((quote.c - quote.o) / quote.o) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Charts</h1>
          <p className="text-foreground/40 text-sm mt-1">Advanced price charts with indicators</p>
        </div>
        <button
          onClick={loadChart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Search + Popular */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            placeholder="Symbol..."
            className="bg-card border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm w-36 focus:outline-none focus:border-emerald-500/50"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          {POPULAR.map((s) => (
            <button
              key={s}
              onClick={() => { setSymbol(s); setInputVal(s); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                symbol === s ? 'bg-emerald-500 text-background' : 'bg-card text-foreground/50 hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quote bar */}
      {quote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-6 bg-card rounded-xl border border-white/5 px-6 py-4 mb-4"
        >
          <div>
            <div className="text-2xl font-bold">{symbol}</div>
          </div>
          <div className="text-2xl font-bold">${quote.c?.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </div>
          {[
            { label: 'Open', value: `$${quote.o?.toFixed(2)}` },
            { label: 'High', value: `$${quote.h?.toFixed(2)}`, color: 'text-emerald-500' },
            { label: 'Low', value: `$${quote.l?.toFixed(2)}`, color: 'text-red-500' },
            { label: 'Volume', value: `${(quote.v / 1_000_000).toFixed(1)}M` },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-foreground/40">{item.label}</div>
              <div className={`text-sm font-medium ${item.color ?? ''}`}>{item.value}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Chart controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Timeframe */}
        <div className="flex gap-1 bg-card rounded-xl p-1 border border-white/5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeframe.label === tf.label ? 'bg-emerald-500 text-background' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart type */}
        <div className="flex gap-1 bg-card rounded-xl p-1 border border-white/5">
          {(['candlestick', 'line', 'area'] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                chartType === type ? 'bg-white/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Indicators */}
        <button
          onClick={() => setShowMA(!showMA)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            showMA ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-card border-white/5 text-foreground/50 hover:text-foreground'
          }`}
        >
          MA20
        </button>
        <button
          onClick={() => setShowVolume(!showVolume)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            showVolume ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-card border-white/5 text-foreground/50 hover:text-foreground'
          }`}
        >
          Volume
        </button>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-white/5 p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 z-10">
            <span className="text-foreground/40 animate-pulse text-sm">Loading chart...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-48">
            <span className="text-red-500/70 text-sm">{error}</span>
          </div>
        )}
        <div ref={chartRef} className="w-full" />
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Candlestick · Line · Area charts · MA20 moving average · Volume bars
      </p>
    </motion.div>
  );
}

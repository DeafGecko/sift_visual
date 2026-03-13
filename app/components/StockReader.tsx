'use client';
import { useA11y } from './AccessibilityProvider';
import { Volume2, VolumeX } from 'lucide-react';

interface StockReaderProps {
  symbol: string;
  price?: number;
  change?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  name?: string;
}

export default function StockReader({ symbol, price, change, open, high, low, volume, name }: StockReaderProps) {
  const { speak, stopSpeaking, isSpeaking } = useA11y();

  const handleRead = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const direction = change && change >= 0 ? 'up' : 'down';
    const changeAbs = change ? Math.abs(change).toFixed(2) : '0';
    const volumeM = volume ? (volume / 1_000_000).toFixed(1) : '0';

    const text = [
      `${name ?? symbol} stock summary.`,
      price ? `Current price: $${price.toFixed(2)}.` : '',
      change !== undefined ? `Today's change: ${direction} ${changeAbs} percent.` : '',
      open ? `Opening price: $${open.toFixed(2)}.` : '',
      high ? `Day high: $${high.toFixed(2)}.` : '',
      low ? `Day low: $${low.toFixed(2)}.` : '',
      volume ? `Trading volume: ${volumeM} million shares.` : '',
    ].filter(Boolean).join(' ');

    speak(text);
  };

  return (
    <button
      onClick={handleRead}
      aria-label={isSpeaking ? `Stop reading ${symbol} data` : `Read ${symbol} stock data aloud`}
      title={isSpeaking ? 'Stop reading' : 'Read stock data aloud'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        isSpeaking
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : 'bg-card border-white/10 text-foreground/50 hover:text-foreground hover:bg-white/10'
      }`}
    >
      {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
      {isSpeaking ? 'Stop' : 'Read Aloud'}
    </button>
  );
}

'use client';
import { motion } from 'framer-motion';
import {
  Settings, Moon, Sun, Monitor, Bell, Zap,
  Clock, Database, Check, RefreshCw, Trash2
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const Section = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-white/5 overflow-hidden mb-4"
  >
    <div className="px-6 py-4 border-b border-white/5">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <p className="text-xs text-foreground/40 mt-0.5">{description}</p>
    </div>
    <div className="divide-y divide-white/5">{children}</div>
  </motion.div>
);

const Row = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between px-6 py-4">
    <div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {description && <div className="text-xs text-foreground/40 mt-0.5">{description}</div>}
    </div>
    <div className="flex-shrink-0 ml-4">{children}</div>
  </div>
);

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-emerald-500' : 'bg-white/10'}`}
  >
    <motion.div
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
    />
  </button>
);

const RadioGroup = ({ options, value, onChange, icons }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  icons?: React.ReactNode[];
}) => (
  <div className="flex gap-2 flex-wrap">
    {options.map((opt, i) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          value === opt
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : 'bg-white/5 border-white/10 text-foreground/50 hover:text-foreground hover:bg-white/10'
        }`}
      >
        {icons?.[i]}
        {opt}
        {value === opt && <Check size={10} />}
      </button>
    ))}
  </div>
);

const ACCENT_COLORS = [
  { name: 'Emerald', color: 'bg-emerald-500' },
  { name: 'Blue', color: 'bg-blue-500' },
  { name: 'Purple', color: 'bg-purple-500' },
  { name: 'Amber', color: 'bg-amber-500' },
  { name: 'Rose', color: 'bg-rose-500' },
];

export default function SettingsPage() {
  const s = useSettingsStore();
  const [saved, setSaved] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearCache = () => {
    queryClient.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleReset = () => {
    s.resetAll();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground max-w-3xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <Settings size={20} className="text-foreground/60" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-foreground/40 text-sm mt-0.5">Customize your SIFT experience</p>
          </div>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-500 text-background hover:bg-emerald-400'
          }`}
        >
          {saved ? <><Check size={14} /> Saved!</> : <><RefreshCw size={14} /> Save Changes</>}
        </motion.button>
      </div>

      {/* Appearance */}
      <Section title="Appearance" description="Customize how SIFT looks and feels">
        <Row label="Theme" description="Choose your preferred color scheme">
          <RadioGroup
            options={['Dark', 'Light', 'System']}
            value={s.theme}
            onChange={s.setTheme}
            icons={[<Moon size={12} />, <Sun size={12} />, <Monitor size={12} />]}
          />
        </Row>
        <Row label="Accent Color" description="Primary color used throughout the app">
          <div className="flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => s.setAccentColor(c.name)}
                title={c.name}
                className={`w-7 h-7 rounded-full ${c.color} transition-all ${
                  s.accentColor === c.name
                    ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-background scale-110'
                    : 'opacity-50 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </Row>
        <Row label="Font Size" description="Adjust text size across the app">
          <RadioGroup
            options={['Small', 'Medium', 'Large']}
            value={s.fontSize}
            onChange={s.setFontSize}
          />
        </Row>
        <Row label="Compact Mode" description="Reduce row spacing to show more data on screen">
          <Toggle enabled={s.compactMode} onChange={() => s.setCompactMode(!s.compactMode)} />
        </Row>
        <Row label="Animations" description="Enable smooth transitions and Framer Motion effects">
          <Toggle enabled={s.animations} onChange={() => s.setAnimations(!s.animations)} />
        </Row>
        <Row label="Color Blind Mode" description="Uses blue/orange instead of green/red for gains and losses">
          <Toggle enabled={s.colorBlindMode} onChange={() => s.setColorBlindMode(!s.colorBlindMode)} />
        </Row>
      </Section>

      {/* Market Data */}
      <Section title="Market Data" description="Control how market data is fetched and displayed">
        <Row label="Auto-refresh Interval" description="How often to automatically fetch new market data">
          <RadioGroup
            options={['30s', '60s', '5m', '15m']}
            value={s.refreshInterval}
            onChange={s.setRefreshInterval}
          />
        </Row>
        <Row label="Price Format" description="Display prices in your preferred currency format">
          <RadioGroup
            options={['USD', 'EUR', 'GBP']}
            value={s.priceFormat}
            onChange={s.setPriceFormat}
          />
        </Row>
        <Row label="Show Pre-market Data" description="Display pre-market prices before 9:30 AM ET">
          <Toggle enabled={s.showPremarket} onChange={() => s.setShowPremarket(!s.showPremarket)} />
        </Row>
        <Row label="Show After-hours Data" description="Display after-hours prices after 4:00 PM ET">
          <Toggle enabled={s.showAfterHours} onChange={() => s.setShowAfterHours(!s.showAfterHours)} />
        </Row>
        <Row label="Data Source" description="Market data provider powering SIFT">
          <div className="flex items-center gap-2 text-xs text-foreground/50 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Database size={12} />
            Polygon.io
          </div>
        </Row>
      </Section>

      {/* Display Preferences */}
      <Section title="Display Preferences" description="Choose what data is visible in tables and charts">
        <Row label="Show Volume" description="Display trading volume column in stock tables">
          <Toggle enabled={s.showVolume} onChange={() => s.setShowVolume(!s.showVolume)} />
        </Row>
        <Row label="Show Change %" description="Display the percentage change column">
          <Toggle enabled={s.showChangePercent} onChange={() => s.setShowChangePercent(!s.showChangePercent)} />
        </Row>
        <Row label="Show Market Cap Badge" description="Display Mega/Large/Mid cap badge in screener">
          <Toggle enabled={s.showMarketCap} onChange={() => s.setShowMarketCap(!s.showMarketCap)} />
        </Row>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Manage alerts and notification preferences">
        <Row label="Market Open Alert" description="Notify when US markets open at 9:30 AM ET">
          <Toggle enabled={s.marketOpen} onChange={() => s.setMarketOpen(!s.marketOpen)} />
        </Row>
        <Row label="Market Close Alert" description="Notify when US markets close at 4:00 PM ET">
          <Toggle enabled={s.marketClose} onChange={() => s.setMarketClose(!s.marketClose)} />
        </Row>
        <Row label="Price Alerts" description="Notify when a watchlisted stock hits your target price">
          <Toggle enabled={s.priceAlerts} onChange={() => s.setPriceAlerts(!s.priceAlerts)} />
        </Row>
        <Row label="News Alerts" description="Notify on major market news and economic events">
          <Toggle enabled={s.newsAlerts} onChange={() => s.setNewsAlerts(!s.newsAlerts)} />
        </Row>
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Data" description="Control what data is stored and shared">
        <Row label="Usage Analytics" description="Help improve SIFT by sharing anonymous usage data">
          <Toggle enabled={s.analytics} onChange={() => s.setAnalytics(!s.analytics)} />
        </Row>
        <Row label="Crash Reports" description="Automatically send error reports to help fix bugs">
          <Toggle enabled={s.crashReports} onChange={() => s.setCrashReports(!s.crashReports)} />
        </Row>
        <Row label="Clear Market Data Cache" description="Force fresh data on next page load">
          <button
            onClick={handleClearCache}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              cacheCleared
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-foreground border-white/10'
            }`}
          >
            {cacheCleared ? <><Check size={12} /> Cleared!</> : <><Trash2 size={12} /> Clear Cache</>}
          </button>
        </Row>
        <Row label="Reset All Settings" description="Restore every setting back to its default value">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-500 border border-red-500/20 transition-colors"
          >
            <RefreshCw size={12} />
            Reset to Defaults
          </button>
        </Row>
      </Section>

      {/* App Info */}
      <div className="bg-card rounded-xl border border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-sm font-semibold">SIFT Visual</div>
            <div className="text-xs text-foreground/40">Version 1.0.0 · Built with Next.js + Polygon.io</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/30">
          <Clock size={12} />
          Data: Polygon.io
        </div>
      </div>

      <p className="text-foreground/20 text-xs mt-4 text-center">
        Settings are saved to your browser automatically · No account required
      </p>
    </motion.div>
  );
}

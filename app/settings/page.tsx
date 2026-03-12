'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Moon, Sun, Monitor, Bell, Globe, Shield,
  RefreshCw, Eye, Zap, Clock, Database, ChevronRight, Check
} from 'lucide-react';

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
  <div className="flex gap-2">
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
        {icons?.[i] && <span>{icons[i]}</span>}
        {opt}
        {value === opt && <Check size={10} />}
      </button>
    ))}
  </div>
);

export default function SettingsPage() {
  // Appearance
  const [theme, setTheme] = useState('Dark');
  const [accentColor, setAccentColor] = useState('Emerald');
  const [fontSize, setFontSize] = useState('Medium');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Market Data
  const [refreshInterval, setRefreshInterval] = useState('60s');
  const [priceFormat, setPriceFormat] = useState('USD');
  const [showPremarket, setShowPremarket] = useState(true);
  const [showAfterHours, setShowAfterHours] = useState(true);
  const [dataSource, setDataSource] = useState('Polygon.io');

  // Notifications
  const [marketOpen, setMarketOpen] = useState(true);
  const [marketClose, setMarketClose] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [newsAlerts, setNewsAlerts] = useState(false);

  // Display
  const [showVolume, setShowVolume] = useState(true);
  const [showChangePercent, setShowChangePercent] = useState(true);
  const [showMarketCap, setShowMarketCap] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);

  // Privacy
  const [analytics, setAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ACCENT_COLORS = [
    { name: 'Emerald', color: 'bg-emerald-500' },
    { name: 'Blue', color: 'bg-blue-500' },
    { name: 'Purple', color: 'bg-purple-500' },
    { name: 'Amber', color: 'bg-amber-500' },
    { name: 'Rose', color: 'bg-rose-500' },
  ];

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
            value={theme}
            onChange={setTheme}
            icons={[<Moon size={12} />, <Sun size={12} />, <Monitor size={12} />]}
          />
        </Row>
        <Row label="Accent Color" description="Primary color used throughout the app">
          <div className="flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setAccentColor(c.name)}
                className={`w-7 h-7 rounded-full ${c.color} transition-all ${
                  accentColor === c.name ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-background scale-110' : 'opacity-60 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </Row>
        <Row label="Font Size" description="Adjust text size across the app">
          <RadioGroup
            options={['Small', 'Medium', 'Large']}
            value={fontSize}
            onChange={setFontSize}
          />
        </Row>
        <Row label="Compact Mode" description="Reduce spacing for more data on screen">
          <Toggle enabled={compactMode} onChange={() => setCompactMode(!compactMode)} />
        </Row>
        <Row label="Animations" description="Enable smooth transitions and motion effects">
          <Toggle enabled={animations} onChange={() => setAnimations(!animations)} />
        </Row>
      </Section>

      {/* Market Data */}
      <Section title="Market Data" description="Control how market data is fetched and displayed">
        <Row label="Auto-refresh Interval" description="How often to fetch new market data">
          <RadioGroup
            options={['30s', '60s', '5m', '15m']}
            value={refreshInterval}
            onChange={setRefreshInterval}
          />
        </Row>
        <Row label="Currency Format" description="Display prices in your preferred currency">
          <RadioGroup
            options={['USD', 'EUR', 'GBP']}
            value={priceFormat}
            onChange={setPriceFormat}
          />
        </Row>
        <Row label="Show Pre-market Data" description="Display pre-market prices before 9:30 AM ET">
          <Toggle enabled={showPremarket} onChange={() => setShowPremarket(!showPremarket)} />
        </Row>
        <Row label="Show After-hours Data" description="Display after-hours prices after 4:00 PM ET">
          <Toggle enabled={showAfterHours} onChange={() => setShowAfterHours(!showAfterHours)} />
        </Row>
        <Row label="Data Source" description="Market data provider">
          <div className="flex items-center gap-2 text-xs text-foreground/50 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Database size={12} />
            {dataSource}
          </div>
        </Row>
      </Section>

      {/* Display Preferences */}
      <Section title="Display Preferences" description="Choose what data columns are visible">
        <Row label="Show Volume" description="Display trading volume in stock tables">
          <Toggle enabled={showVolume} onChange={() => setShowVolume(!showVolume)} />
        </Row>
        <Row label="Show Change %" description="Display percentage change column">
          <Toggle enabled={showChangePercent} onChange={() => setShowChangePercent(!showChangePercent)} />
        </Row>
        <Row label="Show Market Cap" description="Display market cap badge in screener">
          <Toggle enabled={showMarketCap} onChange={() => setShowMarketCap(!showMarketCap)} />
        </Row>
        <Row label="Color Blind Mode" description="Use blue/orange instead of green/red for gains/losses">
          <Toggle enabled={colorBlindMode} onChange={() => setColorBlindMode(!colorBlindMode)} />
        </Row>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Manage alerts and notification preferences">
        <Row label="Market Open Alert" description="Notify when US markets open at 9:30 AM ET">
          <Toggle enabled={marketOpen} onChange={() => setMarketOpen(!marketOpen)} />
        </Row>
        <Row label="Market Close Alert" description="Notify when US markets close at 4:00 PM ET">
          <Toggle enabled={marketClose} onChange={() => setMarketClose(!marketClose)} />
        </Row>
        <Row label="Price Alerts" description="Notify when a stock hits your target price">
          <Toggle enabled={priceAlerts} onChange={() => setPriceAlerts(!priceAlerts)} />
        </Row>
        <Row label="News Alerts" description="Notify on major market news and events">
          <Toggle enabled={newsAlerts} onChange={() => setNewsAlerts(!newsAlerts)} />
        </Row>
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Data" description="Control what data is shared with us">
        <Row label="Usage Analytics" description="Help improve SIFT by sharing anonymous usage data">
          <Toggle enabled={analytics} onChange={() => setAnalytics(!analytics)} />
        </Row>
        <Row label="Crash Reports" description="Automatically send error reports to help fix bugs">
          <Toggle enabled={crashReports} onChange={() => setCrashReports(!crashReports)} />
        </Row>
        <Row label="Clear Cache" description="Reset all cached market data and reload fresh">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-foreground/60 hover:text-foreground border border-white/10 transition-colors">
            Clear Cache
          </button>
        </Row>
        <Row label="Reset All Settings" description="Restore all settings to their defaults">
          <button className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-500 border border-red-500/20 transition-colors">
            Reset
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
        Settings are saved locally · Some features require account (coming soon)
      </p>
    </motion.div>
  );
}

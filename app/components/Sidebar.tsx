'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, LayoutDashboard, TrendingUp, BarChart2, DollarSign,
  Map, Filter, LineChart, BookOpen, Settings, Info,
  Star, Bell, Search, X
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Market overview' },
  { label: 'Stocks', href: '/markets/stocks', icon: TrendingUp, description: '25 top stocks' },
  { label: 'Futures', href: '/markets/futures', icon: BarChart2, description: 'Equity and commodity futures' },
  { label: 'Forex', href: '/markets/forex', icon: DollarSign, description: 'Currency pair exchange rates' },
  { label: 'Heat Map', href: '/tools/heatmap', icon: Map, description: 'Visual market performance grid' },
  { label: 'Screener', href: '/tools/screener', icon: Filter, description: 'Filter stocks by criteria' },
  { label: 'Charts', href: '/tools/charts', icon: LineChart, description: 'Advanced interactive charts' },
  { label: 'Watchlist', href: '/watchlist', icon: Star, description: 'Your saved favorite stocks' },
  { label: 'Learning Lab', href: '/learning', icon: BookOpen, description: 'Financial education and glossary' },
  { label: 'Settings', href: '/settings', icon: Settings, description: 'App preferences and accessibility' },
  { label: 'About', href: '/about', icon: Info, description: 'About SIFT Visual' },
];

const ALL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' }, { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' }, { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' }, { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' }, { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'NFLX', name: 'Netflix Inc.' }, { symbol: 'PYPL', name: 'PayPal Holdings' },
  { symbol: 'BA', name: 'Boeing Co.' }, { symbol: 'DIS', name: 'Walt Disney Co.' },
  { symbol: 'UBER', name: 'Uber Technologies' }, { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'COIN', name: 'Coinbase Global' }, { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'PFE', name: 'Pfizer Inc.' }, { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' }, { symbol: 'SNAP', name: 'Snap Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology' }, { symbol: 'RBLX', name: 'Roblox Corp.' },
  { symbol: 'PLTR', name: 'Palantir Technologies' }, { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'XOM', name: 'Exxon Mobil' },
];

const NOTIFICATIONS = [
  { id: 1, title: 'Market Opens in 30 min', desc: 'US markets open at 9:30 AM ET', time: '9:00 AM', color: 'bg-emerald-500' },
  { id: 2, title: 'Learning Lab Updated', desc: '5 new financial terms added', time: 'Today', color: 'bg-blue-500' },
  { id: 3, title: 'SIFT Visual v1.0', desc: 'Welcome! Explore all 10 pages', time: 'Today', color: 'bg-purple-500' },
];

function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = et.getDay();
      const time = et.getHours() * 60 + et.getMinutes();
      setIsOpen(day >= 1 && day <= 5 && time >= 570 && time < 960);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);
  return isOpen;
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.length > 0
    ? ALL_STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const navItems = query.length > 0
    ? NAV_ITEMS.filter(n => n.label.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search size={16} className="text-foreground/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stocks, pages..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        {(results.length > 0 || navItems.length > 0) ? (
          <div className="py-2 max-h-72 overflow-y-auto">
            {results.length > 0 && (
              <>
                <p className="text-xs text-foreground/30 uppercase tracking-wider px-4 py-1">Stocks</p>
                {results.map(s => (
                  <button key={s.symbol} onClick={() => handleSelect(`/markets/stocks/${s.symbol}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">{s.symbol.slice(0, 2)}</div>
                    <div>
                      <div className="text-sm font-semibold">{s.symbol}</div>
                      <div className="text-xs text-foreground/40">{s.name}</div>
                    </div>
                  </button>
                ))}
              </>
            )}
            {navItems.length > 0 && (
              <>
                <p className="text-xs text-foreground/30 uppercase tracking-wider px-4 py-1 mt-1">Pages</p>
                {navItems.map(n => {
                  const Icon = n.icon;
                  return (
                    <button key={n.href} onClick={() => handleSelect(n.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                      <Icon size={15} className="text-foreground/40" />
                      <div>
                        <div className="text-sm font-semibold">{n.label}</div>
                        <div className="text-xs text-foreground/40">{n.description}</div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        ) : query.length > 0 ? (
          <div className="px-4 py-6 text-center text-sm text-foreground/30">No results for "{query}"</div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-xs text-foreground/30 uppercase tracking-wider mb-2">Quick Links</p>
            <div className="grid grid-cols-2 gap-1">
              {NAV_ITEMS.slice(0, 6).map(n => {
                const Icon = n.icon;
                return (
                  <button key={n.href} onClick={() => handleSelect(n.href)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <Icon size={13} className="text-foreground/40" />
                    <span className="text-xs text-foreground/60">{n.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-foreground/20">Press Esc to close</span>
          <span className="text-xs text-foreground/20">Enter to navigate</span>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute bottom-16 left-56 ml-2 w-72 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-bold">Notifications</span>
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground"><X size={14} /></button>
        </div>
        <div className="divide-y divide-white/5">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-foreground/40 mt-0.5">{n.desc}</div>
              </div>
              <span className="text-xs text-foreground/30 flex-shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-white/5 text-center">
          <span className="text-xs text-foreground/30">More notifications coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useMarketStatus();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <aside id="sidebar-nav" aria-label="Main navigation" className="fixed left-0 top-0 bottom-0 w-56 bg-card border-r border-white/5 flex flex-col z-30">
        <div className="px-4 py-5 border-b border-white/5">
          <Link href="/" aria-label="SIFT Visual home" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center" aria-hidden="true">
              <Zap size={16} className="text-background" fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight">SIFT</span>
          </Link>
        </div>

        <div className="mx-3 my-2">
          <div role="status" aria-live="polite" aria-label={`Market is ${isOpen ? 'open' : 'closed'}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            Market {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto" aria-label="Site sections">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} aria-label={item.description} aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'text-foreground/50 hover:text-foreground hover:bg-white/5'}`}>
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-foreground/60" aria-label="User profile">N</div>
          <div className="flex items-center gap-3 text-foreground/30" role="toolbar" aria-label="Quick actions">
            <button onClick={() => setShowSearch(true)} aria-label="Search stocks and pages" title="Search" className="hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5">
              <Search size={15} aria-hidden="true" />
            </button>
            <Link href="/watchlist" aria-label="View watchlist" title="Watchlist" className="hover:text-amber-400 transition-colors p-1 rounded-lg hover:bg-white/5">
              <Star size={15} aria-hidden="true" />
            </Link>
            <button onClick={() => setShowNotifications(!showNotifications)} aria-label={`View ${NOTIFICATIONS.length} notifications`} title="Notifications" className={`relative transition-colors p-1 rounded-lg hover:bg-white/5 ${showNotifications ? 'text-foreground' : 'hover:text-foreground'}`}>
              <Bell size={15} aria-hidden="true" />
              {NOTIFICATIONS.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold" style={{fontSize: '9px'}}>
                  {NOTIFICATIONS.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </>
  );
}

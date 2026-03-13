'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Zap, LayoutDashboard, TrendingUp, BarChart2, DollarSign,
  Map, Filter, LineChart, BookOpen, Settings, Info,
  Star, Bell, Globe, Search
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Market overview with indices and top movers' },
  { label: 'Stocks', href: '/markets/stocks', icon: TrendingUp, description: 'Browse and search 25 top stocks' },
  { label: 'Futures', href: '/markets/futures', icon: BarChart2, description: 'Equity, commodity and bond futures' },
  { label: 'Forex', href: '/markets/forex', icon: DollarSign, description: 'Currency pair exchange rates' },
  { label: 'Heat Map', href: '/tools/heatmap', icon: Map, description: 'Visual market performance grid' },
  { label: 'Screener', href: '/tools/screener', icon: Filter, description: 'Filter stocks by custom criteria' },
  { label: 'Charts', href: '/tools/charts', icon: LineChart, description: 'Advanced interactive price charts' },
  { label: 'Watchlist', href: '/watchlist', icon: Star, description: 'Your saved favorite stocks' },
  { label: 'Learning Lab', href: '/learning', icon: BookOpen, description: 'Financial education and glossary' },
  { label: 'Settings', href: '/settings', icon: Settings, description: 'App preferences and accessibility' },
  { label: 'About', href: '/about', icon: Info, description: 'About SIFT Visual' },
];

function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = et.getDay();
      const hours = et.getHours();
      const minutes = et.getMinutes();
      const time = hours * 60 + minutes;
      setIsOpen(day >= 1 && day <= 5 && time >= 570 && time < 960);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);
  return isOpen;
}

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useMarketStatus();

  return (
    <aside
      id="sidebar-nav"
      aria-label="Main navigation"
      className="fixed left-0 top-0 bottom-0 w-56 bg-card border-r border-white/5 flex flex-col z-30"
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <Link
          href="/"
          aria-label="SIFT Visual — go to dashboard"
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center" aria-hidden="true">
            <Zap size={16} className="text-background" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight">SIFT VISUAL</span>
        </Link>
      </div>

      {/* Market Status */}
      <div className="mx-3 my-2">
        <div
          role="status"
          aria-live="polite"
          aria-label={`Market is currently ${isOpen ? 'open' : 'closed'}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
            isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}
        >
          <span aria-hidden="true" className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          Market {isOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto"
        aria-label="Site sections"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.description}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom icons */}
      <div className="px-4 py-4 border-t border-white/5 flex items-center justify-between">
        <div
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-foreground/60"
          aria-label="User profile (coming soon)"
          role="img"
        >
          N
        </div>
        <div className="flex items-center gap-3 text-foreground/30" role="toolbar" aria-label="Quick actions">
          <button aria-label="Search" className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
            <Search size={15} aria-hidden="true" />
          </button>
          <Link href="/watchlist" aria-label="View watchlist" className="hover:text-amber-400 transition-colors">
            <Star size={15} aria-hidden="true" />
          </Link>
          <button aria-label="Notifications (coming soon)" className="hover:text-foreground transition-colors">
            <Bell size={15} aria-hidden="true" />
          </button>
          <button aria-label="Language settings (coming soon)" className="hover:text-foreground transition-colors">
            <Globe size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

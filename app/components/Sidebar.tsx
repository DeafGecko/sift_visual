'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, LayoutDashboard, TrendingUp, BarChart2, DollarSign,
  Map, Filter, LineChart, BookOpen, Settings, Info,
  Star, Bell, Globe, Search
} from 'lucide-react';
import { useMarketStatus } from '@/hooks/useMarketStatus';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Stocks', href: '/markets/stocks', icon: TrendingUp },
  { label: 'Futures', href: '/markets/futures', icon: BarChart2 },
  { label: 'Forex', href: '/markets/forex', icon: DollarSign },
  { label: 'Heat Map', href: '/tools/heatmap', icon: Map },
  { label: 'Screener', href: '/tools/screener', icon: Filter },
  { label: 'Charts', href: '/tools/charts', icon: LineChart },
  { label: 'Watchlist', href: '/watchlist', icon: Star },
  { label: 'Learning Lab', href: '/learning', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'About', href: '/about', icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-card border-r border-white/5 flex flex-col z-30">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-background" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight">SIFT</span>
        </Link>
      </div>

      {/* Market Status */}
      <MarketStatusBadge />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom icons */}
      <div className="px-4 py-4 border-t border-white/5 flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-foreground/60">
          N
        </div>
        <div className="flex items-center gap-3 text-foreground/30">
          <button className="hover:text-foreground transition-colors"><Search size={15} /></button>
          <Link href="/watchlist" className="hover:text-amber-400 transition-colors"><Star size={15} /></Link>
          <button className="hover:text-foreground transition-colors"><Bell size={15} /></button>
          <button className="hover:text-foreground transition-colors"><Globe size={15} /></button>
        </div>
      </div>
    </aside>
  );
}

function MarketStatusBadge() {
  const isOpen = useMarketStatus();
  return (
    <div className="mx-3 my-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
        isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        Market {isOpen ? 'Open' : 'Closed'}
      </div>
    </div>
  );
}

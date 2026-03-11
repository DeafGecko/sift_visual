'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart2,
  DollarSign,
  Map,
  Filter,
  LineChart,
  BookOpen,
  Settings,
  Info,
  Activity,
  Bell,
  Star,
  Search,
  Globe,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Stocks', href: '/markets/stocks', icon: TrendingUp },
  { label: 'Futures', href: '/markets/futures', icon: BarChart2 },
  { label: 'Forex', href: '/markets/forex', icon: DollarSign },
  { label: 'Heat Map', href: '/tools/heatmap', icon: Map },
  { label: 'Screener', href: '/tools/screener', icon: Filter },
  { label: 'Charts', href: '/tools/charts', icon: LineChart },
  { label: 'Learning Lab', href: '/learning', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'About', href: '/about', icon: Info },
];

function useMarketStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Convert to Eastern Time properly (handles DST automatically)
  const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hours = easternTime.getHours();
  const minutes = easternTime.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Market open: Mon-Fri 9:30 AM - 4:00 PM Eastern
  const marketOpen = 9 * 60 + 30;   // 9:30 AM
  const marketClose = 16 * 60;       // 4:00 PM
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = timeInMinutes >= marketOpen && timeInMinutes < marketClose;
  const isOpen = isWeekday && isMarketHours;

  return isOpen;
}

export default function Sidebar() {
  const pathname = usePathname();
  const isMarketOpen = useMarketStatus();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-card border-r border-white/10 flex flex-col p-4 gap-1">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <Zap size={18} className="text-emerald-500" />
        <span className="text-xl font-bold text-foreground">SIFT</span>
      </div>

      {/* Market Status Badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
        isMarketOpen ? 'bg-emerald-500/10' : 'bg-red-500/10'
      }`}>
        {/* Pulsing dot */}
        <div className="relative flex items-center justify-center">
          <span className={`absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping ${
            isMarketOpen ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${
            isMarketOpen ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
        </div>
        <Activity size={12} className={isMarketOpen ? 'text-emerald-500' : 'text-red-500'} />
        <span className={`text-xs font-semibold ${
          isMarketOpen ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {isMarketOpen ? 'Market Open' : 'Market Closed'}
        </span>
      </div>

      {/* Main Nav */}
      {navItems.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${pathname === href
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
            }`}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}

      {/* Bottom Icons */}
      <div className="mt-auto flex items-center justify-around px-2 py-3 border-t border-white/10">
        <button className="text-foreground/40 hover:text-foreground transition-colors">
          <Search size={16} />
        </button>
        <button className="text-foreground/40 hover:text-foreground transition-colors">
          <Star size={16} />
        </button>
        <button className="text-foreground/40 hover:text-foreground transition-colors">
          <Bell size={16} />
        </button>
        <button className="text-foreground/40 hover:text-foreground transition-colors">
          <Globe size={16} />
        </button>
      </div>

    </aside>
  );
}

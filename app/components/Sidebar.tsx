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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-card border-r border-white/10 flex flex-col p-4 gap-1">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 px-2">
        <Zap size={18} className="text-accent-green" />
        <span className="text-xl font-bold text-foreground">SIFT</span>
        <span className="text-xs text-accent-green font-medium ml-auto flex items-center gap-1">
          <Activity size={10} />
          LIVE
        </span>
      </div>

      {/* Main Nav */}
      {navItems.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${pathname === href
              ? 'bg-accent-green/10 text-accent-green'
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

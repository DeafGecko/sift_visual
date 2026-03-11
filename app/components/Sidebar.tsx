'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, BarChart2, DollarSign, Map, Filter, LineChart, BookOpen, Settings, Info } from 'lucide-react';

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
      <div className="text-xl font-bold text-foreground mb-6 px-2">SIFT VISUAL</div>
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
    </aside>
  );
}

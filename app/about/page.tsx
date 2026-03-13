'use client';
import { motion } from 'framer-motion';
import { Zap, BarChart2, Globe, Shield, BookOpen, Star, TrendingUp, Code2, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  { icon: TrendingUp, label: 'Live Markets', desc: 'Real-time quotes for 25 top stocks, futures, and 15 forex pairs powered by Polygon.io', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: BarChart2, label: 'Advanced Charts', desc: 'Candlestick, line, and area charts with MA20 overlays and 6-month history', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Globe, label: 'Heat Map', desc: 'Visual grid showing market performance at a glance with sector filtering', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Star, label: 'Watchlist', desc: 'Save your favorite stocks and track them all in one place, persisted locally', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: BookOpen, label: 'Learning Lab', desc: '50+ financial terms explained with real examples — perfect for beginners', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Shield, label: 'Accessibility', desc: 'Screen reader support, text scaling, high contrast, pause animation, and keyboard navigation', color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const STACK = [
  { name: 'Next.js 16', desc: 'React framework' },
  { name: 'TypeScript', desc: 'Type safety' },
  { name: 'Tailwind v4', desc: 'Styling' },
  { name: 'Framer Motion', desc: 'Animations' },
  { name: 'Zustand', desc: 'State management' },
  { name: 'React Query', desc: 'Data fetching' },
  { name: 'Polygon.io', desc: 'Market data' },
  { name: 'Vercel', desc: 'Deployment' },
  { name: 'lightweight-charts', desc: 'Candlestick charts' },
  { name: 'Lucide React', desc: 'Icons' },
];

const PAGES = [
  { label: 'Dashboard', href: '/', desc: 'Market overview' },
  { label: 'Stocks', href: '/markets/stocks', desc: '25 top stocks' },
  { label: 'Futures', href: '/markets/futures', desc: 'ETF proxies' },
  { label: 'Forex', href: '/markets/forex', desc: '15 currency pairs' },
  { label: 'Heat Map', href: '/tools/heatmap', desc: 'Visual grid' },
  { label: 'Screener', href: '/tools/screener', desc: 'Filter stocks' },
  { label: 'Charts', href: '/tools/charts', desc: 'Advanced charts' },
  { label: 'Watchlist', href: '/watchlist', desc: 'Saved stocks' },
  { label: 'Learning Lab', href: '/learning', desc: '50+ terms' },
  { label: 'Settings', href: '/settings', desc: 'Preferences' },
];

const A11Y_BADGES = [
  'Screen Reader Support', 'Text Scaling', 'High Contrast Mode',
  'Pause Animation', 'Keyboard Navigation', 'ARIA Labels',
  'Skip Links', 'Read Aloud', 'Focus Indicators', 'Safe for Photosensitive Users'
];

export default function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="px-8 py-16 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Zap size={22} className="text-black" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">SIFT Visual</h1>
                <p className="text-foreground/40 text-sm">Market Intelligence Dashboard</p>
              </div>
            </div>
            <p className="text-xl text-foreground/70 leading-relaxed max-w-2xl">
              A modern, accessible financial terminal built for everyone. Real-time market data, beautiful visualizations,
              and a built-in learning system to help you understand what it all means.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-xl transition-colors">
                <Zap size={14} fill="currentColor" />
                Open Dashboard
              </Link>
              <a href="https://github.com/DeafGecko/sift_visual" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-card border border-white/10 hover:bg-white/10 text-foreground/70 text-sm font-semibold rounded-xl transition-colors">
                <Code2 size={14} />
                View on GitHub
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-8 py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '25', label: 'Stocks tracked', color: 'text-emerald-500' },
            { value: '15', label: 'Forex pairs', color: 'text-blue-400' },
            { value: '50+', label: 'Learning Lab terms', color: 'text-purple-400' },
            { value: '10', label: 'Pages and tools', color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="bg-card rounded-2xl px-5 py-5 border border-white/5">
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-foreground/40">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <h2 className="text-xl font-bold mb-1">Features</h2>
          <p className="text-foreground/40 text-sm mb-6">Everything you need to understand the market</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="bg-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={18} className={f.color} />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{f.label}</h3>
                  <p className="text-xs text-foreground/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
          <h2 className="text-xl font-bold mb-1">All Pages</h2>
          <p className="text-foreground/40 text-sm mb-6">Navigate directly to any section</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PAGES.map((page, i) => (
              <motion.div key={page.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.03 }}>
                <Link href={page.href} className="flex flex-col gap-1 bg-card hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-xl px-4 py-3 transition-all group">
                  <span className="text-sm font-semibold group-hover:text-emerald-400 transition-colors">{page.label}</span>
                  <span className="text-xs text-foreground/40">{page.desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12">
          <h2 className="text-xl font-bold mb-1">Built With</h2>
          <p className="text-foreground/40 text-sm mb-6">Modern open-source technologies</p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech, i) => (
              <motion.div key={tech.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.03 }} className="flex items-center gap-2 bg-card border border-white/5 rounded-xl px-3 py-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium">{tech.name}</span>
                <span className="text-xs text-foreground/30">{tech.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-12 bg-card rounded-2xl border border-white/5 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor" className="text-rose-400">
                <circle cx="50" cy="13" r="11"/>
                <path d="M73 32H56l-3 15h14l8 20a5 5 0 0 0 9-4L74 40z"/>
                <path d="M53 49l-3-17H30a5 5 0 0 0 0 10h16l2 10-14 4a5 5 0 0 0-3 6l6 20a5 5 0 0 0 9-3l-4-15 14-4a5 5 0 0 0 4-5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Accessibility First</h2>
              <p className="text-sm text-foreground/60 leading-relaxed mb-3">
                SIFT Visual is built with every user in mind. Whether you use a screen reader, need larger text,
                require high contrast, or are sensitive to motion — we have you covered.
              </p>
              <div className="flex flex-wrap gap-2">
                {A11Y_BADGES.map((item) => (
                  <span key={item} className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-lg">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="border-t border-white/5 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap size={12} className="text-black" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold">SIFT Visual</span>
            <span className="text-foreground/20 text-xs">v1.0.0</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground/30">
            Built with <Heart size={11} className="text-rose-500 mx-1" fill="currentColor" /> using Next.js + Polygon.io
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

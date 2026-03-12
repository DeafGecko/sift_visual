'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import EduTooltip from '@/app/components/EduTooltip';

const PAIRS = [
  { from: 'EUR', to: 'USD', name: 'Euro / US Dollar', category: 'Major' },
  { from: 'GBP', to: 'USD', name: 'British Pound / US Dollar', category: 'Major' },
  { from: 'USD', to: 'JPY', name: 'US Dollar / Japanese Yen', category: 'Major' },
  { from: 'USD', to: 'CHF', name: 'US Dollar / Swiss Franc', category: 'Major' },
  { from: 'AUD', to: 'USD', name: 'Australian Dollar / US Dollar', category: 'Major' },
  { from: 'USD', to: 'CAD', name: 'US Dollar / Canadian Dollar', category: 'Major' },
  { from: 'NZD', to: 'USD', name: 'New Zealand Dollar / US Dollar', category: 'Major' },
  { from: 'EUR', to: 'GBP', name: 'Euro / British Pound', category: 'Cross' },
  { from: 'EUR', to: 'JPY', name: 'Euro / Japanese Yen', category: 'Cross' },
  { from: 'GBP', to: 'JPY', name: 'British Pound / Japanese Yen', category: 'Cross' },
  { from: 'EUR', to: 'CHF', name: 'Euro / Swiss Franc', category: 'Cross' },
  { from: 'AUD', to: 'JPY', name: 'Australian Dollar / Japanese Yen', category: 'Cross' },
  { from: 'USD', to: 'MXN', name: 'US Dollar / Mexican Peso', category: 'Exotic' },
  { from: 'USD', to: 'SGD', name: 'US Dollar / Singapore Dollar', category: 'Exotic' },
  { from: 'USD', to: 'HKD', name: 'US Dollar / Hong Kong Dollar', category: 'Exotic' },
];

const categories = ['All', 'Major', 'Cross', 'Exotic'];

const useForexRate = (from: string, to: string) => {
  return useQuery({
    queryKey: ['forex', from, to],
    queryFn: async () => {
      const res = await fetch(`/api/forex?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

const ForexRow = ({ from, to, name, category, index }: { from: string; to: string; name: string; category: string; index: number }) => {
  const { data, isLoading } = useForexRate(from, to);
  const rate = data?.rate;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-foreground">
            {from}/{to}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{from}/{to}</div>
            <div className="text-xs text-foreground/40">{name}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/50">{category}</span>
      </td>
      <td className="py-3 px-4 text-right">
        {isLoading ? <span className="text-foreground/30 text-sm animate-pulse">Loading...</span> : (
          <span className="text-sm font-medium text-foreground">{rate ? rate.toFixed(4) : 'N/A'}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-foreground/50">1 {from}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-foreground/50">{to}</span>
      </td>
    </motion.tr>
  );
};

export default function ForexPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const filtered = PAIRS.filter((p) => activeCategory === 'All' || p.category === activeCategory);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Forex</h1>
          <p className="text-foreground/40 text-sm mt-1">Major, Cross and Exotic currency pairs</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm font-medium transition-colors"
        >
          <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8, ease: 'linear' }}>
            <RefreshCw size={14} />
          </motion.div>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="flex gap-2 mt-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat ? 'bg-emerald-500 text-background' : 'bg-card text-foreground/50 hover:text-foreground hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-left text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Pair">Pair</EduTooltip>
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Type">Type</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Rate">Rate</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Base">Base</EduTooltip>
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                <EduTooltip term="Quote">Quote</EduTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pair, index) => (
              <ForexRow key={`${pair.from}${pair.to}`} from={pair.from} to={pair.to} name={pair.name} category={pair.category} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-foreground/20 text-xs mt-4">
        Live exchange rates · Hover column headers for definitions · Updates every 60 seconds
      </p>
    </motion.div>
  );
}

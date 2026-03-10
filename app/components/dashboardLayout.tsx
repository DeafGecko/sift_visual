'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

const fetchMarketData = async () => {
  return {
    indices: [{ name: 'S&P 500', value: 4500, change: 1.2 }],
    topGainers: [{ symbol: 'AAPL', price: 150, change: 2.5 }],
  };
};

const DashboardLayout: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['marketData'], queryFn: fetchMarketData });

  if (isLoading) return <div className="text-foreground">Loading...</div>;

  return (
    <TooltipProvider>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground p-8 font-sans"
      >
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-none shadow-sm">
            <CardHeader>
              <CardTitle>Major Indices</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.indices.map((index) => (
                <div key={index.name} className="flex justify-between mb-2">
                  <span>{index.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={index.change > 0 ? 'text-accent-green' : 'text-accent-red'}>
                        {index.value} ({index.change}%)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage change from previous close.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-none shadow-sm">
            <CardHeader>
              <CardTitle>Top Gainers</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.topGainers.map((stock) => (
                <div key={stock.symbol} className="flex justify-between mb-2">
                  <span>{stock.symbol}</span>
                  <span className="text-accent-green">{stock.price} (+{stock.change}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <button
          className="fixed bottom-4 right-4 bg-card p-2 rounded-full"
          aria-label="Open Research Guide"
          onClick={() => {}}
        >
          ?
        </button>
      </motion.main>
    </TooltipProvider>
  );
};

export default DashboardLayout;

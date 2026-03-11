'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTopGainers, useTopLosers, useStockData } from '@/hooks/useStocks';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';

// Indices Component
const IndexCard = ({ symbol, label }: { symbol: string; label: string }) => {
  const { data, isLoading } = useStockData(symbol);
  const result = data?.results?.[0];
  const change = result ? ((result.c - result.o) / result.o * 100).toFixed(2) : null;
  const isPositive = change && parseFloat(change) > 0;

  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-foreground/70 text-sm">{label}</span>
      {isLoading ? (
        <span className="text-foreground/40 text-sm">Loading...</span>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`text-sm font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
              ${result?.c?.toFixed(2)} ({isPositive ? '+' : ''}{change}%)
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open: ${result?.o?.toFixed(2)} | High: ${result?.h?.toFixed(2)} | Low: ${result?.l?.toFixed(2)}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

// Gainers/Losers Component
const StockRow = ({ ticker, isGainer }: { ticker: any; isGainer: boolean }) => {
  const change = ticker?.todaysChangePerc?.toFixed(2);
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-foreground text-sm font-medium">{ticker?.ticker}</span>
      <div className="text-right">
        <span className="text-foreground/70 text-xs block">${ticker?.day?.c?.toFixed(2)}</span>
        <span className={`text-xs font-medium ${isGainer ? 'text-accent-green' : 'text-accent-red'}`}>
          {isGainer ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: gainersData, isLoading: gainersLoading } = useTopGainers();
  const { data: losersData, isLoading: losersLoading } = useTopLosers();
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const gainers = gainersData?.tickers?.slice(0, 5) || [];
  const losers = losersData?.tickers?.slice(0, 5) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <TooltipProvider>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground p-8 font-sans"
      >
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-white/10 text-foreground/70 hover:text-foreground text-sm font-medium transition-colors"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.8, ease: 'linear' }}
            >
              <RefreshCw size={14} />
            </motion.div>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Last updated time */}
        <p className="text-foreground/40 text-sm mb-8">
          Live market overview — auto updates every 60s · Last updated: {lastUpdated.toLocaleTimeString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Major Indices */}
          <Card className="bg-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Major Indices</CardTitle>
            </CardHeader>
            <CardContent>
              <IndexCard symbol="SPY" label="S&P 500" />
              <IndexCard symbol="QQQ" label="NASDAQ" />
              <IndexCard symbol="DIA" label="DOW JONES" />
              <IndexCard symbol="IWM" label="RUSSELL 2000" />
            </CardContent>
          </Card>

          {/* Top Gainers */}
          <Card className="bg-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">🟢 Top Gainers</CardTitle>
            </CardHeader>
            <CardContent>
              {gainersLoading ? (
                <p className="text-foreground/40 text-sm">Loading...</p>
              ) : gainers.length > 0 ? (
                gainers.map((ticker: any) => (
                  <StockRow key={ticker.ticker} ticker={ticker} isGainer={true} />
                ))
              ) : (
                <p className="text-foreground/40 text-sm">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="bg-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">🔴 Top Losers</CardTitle>
            </CardHeader>
            <CardContent>
              {losersLoading ? (
                <p className="text-foreground/40 text-sm">Loading...</p>
              ) : losers.length > 0 ? (
                losers.map((ticker: any) => (
                  <StockRow key={ticker.ticker} ticker={ticker} isGainer={false} />
                ))
              ) : (
                <p className="text-foreground/40 text-sm">No data available</p>
              )}
            </CardContent>
          </Card>

        </div>
      </motion.main>
    </TooltipProvider>
  );
};

export default DashboardLayout;

import { DollarSign, Percent, Activity } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { StockList } from '../components/dashboard/StockList';
import { StockDetail } from '../components/dashboard/StockDetail';
import { useEffect, useState } from 'react';
import { fetchStockGroup, fetchStockExchange } from '../lib/api';
import type { StockTrackingInfo } from '../lib/api';

export function Dashboard() {
  const [stocks, setStocks] = useState<StockTrackingInfo[]>([]);
  const [filterType, setFilterType] = useState<'group' | 'exchange'>('group');
  const [filterValue, setFilterValue] = useState<string>('VN30');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  useEffect(() => {
    setStocks([]); // Clear old stocks when fetching
    if (filterType === 'group') {
      fetchStockGroup(filterValue).then(setStocks).catch(console.error);
    } else {
      fetchStockExchange(filterValue).then(setStocks).catch(console.error);
    }
  }, [filterType, filterValue]);

  const totalValue = stocks.reduce((acc, stock) => acc + stock.nmTotalTradedValue, 0);
  const totalValueChange = stocks.reduce((acc, stock) => acc + stock.priceChange, 0); // basic
  const topGainer = stocks.reduce((max, stock) => stock.priceChangePercent > (max?.priceChangePercent || -Infinity) ? stock : max, stocks[0] || null);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Welcome back, Alex
          </h1>
          <p className="text-slate-400">
            Here is your portfolio overview for today.
          </p>
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-3">
          <select 
            className="bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-primary-500 cursor-pointer shadow-sm transition-colors"
            value={filterType}
            onChange={(e) => {
              const newType = e.target.value as 'group' | 'exchange';
              setFilterType(newType);
              setFilterValue(newType === 'group' ? 'VN30' : 'hose');
            }}
          >
            <option value="group">By Group</option>
            <option value="exchange">By Exchange</option>
          </select>

          <select
            className="bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-primary-500 cursor-pointer shadow-sm transition-colors"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            {filterType === 'group' ? (
              <>
                <option value="VN30">VN30</option>
                <option value="VNINDEX">VNINDEX</option>
              </>
            ) : (
              <>
                <option value="hose">HOSE</option>
                <option value="hnx">HNX</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Traded Value" 
          value={totalValue ? (totalValue / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "M" : "..."} 
          change={totalValueChange ? totalValueChange : 0} 
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard 
          title="Market Trend" 
          value={totalValueChange >= 0 ? "Bullish" : "Bearish"} 
          change={0} 
          icon={<Activity className="w-6 h-6" />}
          isCurrency={false}
        />
        <StatCard 
          title="Top Gainer" 
          value={topGainer ? topGainer.stockSymbol : "..."} 
          change={topGainer ? topGainer.priceChangePercent : 0} 
          icon={<Percent className="w-6 h-6" />}
          isCurrency={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        <StockList stocks={stocks} onSelect={setSelectedStock} />
      </div>

      {/* Detail Overlay */}
      {selectedStock && (
        <StockDetail symbol={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}

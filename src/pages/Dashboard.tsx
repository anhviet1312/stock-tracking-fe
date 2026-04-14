import { DollarSign, Percent, Activity, Search } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { StockList } from '../components/dashboard/StockList';
import { StockDetail } from '../components/dashboard/StockDetail';
import { useEffect, useState } from 'react';
import { fetchStockGroup, fetchStockExchange, getFavouriteStocks, getFavouriteSymbols } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import type { StockTrackingInfo } from '../lib/api';

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [stocks, setStocks] = useState<StockTrackingInfo[]>([]);
  const [filterType, setFilterType] = useState<'group' | 'exchange' | 'favourites'>('group');
  const [filterValue, setFilterValue] = useState<string>('VN30');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favouriteSymbols, setFavouriteSymbols] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshFavouriteSymbols = () => {
    if (isAuthenticated) {
      getFavouriteSymbols().then(setFavouriteSymbols).catch(console.error);
    }
  };

  useEffect(() => {
    refreshFavouriteSymbols();
  }, [isAuthenticated]);

  useEffect(() => {
    setStocks([]); // Clear old stocks when fetching
    setIsLoading(true);
    
    let promise: Promise<StockTrackingInfo[]> | undefined;
    if (filterType === 'group') {
      promise = fetchStockGroup(filterValue);
    } else if (filterType === 'exchange') {
      promise = fetchStockExchange(filterValue);
    } else if (filterType === 'favourites') {
      promise = getFavouriteStocks();
    }

    promise?.then(setStocks).catch(console.error).finally(() => setIsLoading(false));
  }, [filterType, filterValue]);

  const displayedStocks = stocks.filter(stock => 
    !searchQuery || 
    (stock.stockSymbol && stock.stockSymbol.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const totalValue = displayedStocks.reduce((acc, stock) => acc + (stock.nmTotalTradedValue || 0), 0);
  const totalValueChange = displayedStocks.reduce((acc, stock) => acc + (stock.priceChange || 0), 0);
  const topGainer = displayedStocks.reduce((max, stock) => (stock.priceChangePercent || 0) > (max?.priceChangePercent || -Infinity) ? stock : max, displayedStocks[0] || null);

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

        {/* Filter Selectors & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search symbol..."
              className="bg-dark-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary-500 shadow-sm transition-colors w-36 md:w-48 placeholder:text-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-primary-500 cursor-pointer shadow-sm transition-colors"
            value={filterType}
            onChange={(e) => {
              const newType = e.target.value as 'group' | 'exchange' | 'favourites';
              setFilterType(newType);
              if (newType === 'group') setFilterValue('VN30');
              else if (newType === 'exchange') setFilterValue('hose');
              else setFilterValue('');
            }}
          >
            <option value="group">By Group</option>
            <option value="exchange">By Exchange</option>
            {isAuthenticated && <option value="favourites">Favourites</option>}
          </select>

          {filterType !== 'favourites' && (
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
          )}
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
        <StockList 
          stocks={displayedStocks} 
          onSelect={setSelectedStock} 
          isLoading={isLoading}
          emptyMessage={filterType === 'favourites' ? 'No stock in list favourite' : 'No stocks available'}
          favouriteSymbols={favouriteSymbols}
          onFavouriteSuccess={refreshFavouriteSymbols}
        />
      </div>

      {/* Detail Overlay */}
      {selectedStock && (
        <StockDetail symbol={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}

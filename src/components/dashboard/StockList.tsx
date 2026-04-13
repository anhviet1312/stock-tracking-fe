import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { StockTrackingInfo } from '../../lib/api';

interface StockListProps {
  stocks: StockTrackingInfo[];
  onSelect?: (symbol: string) => void;
}

export function StockList({ stocks, onSelect }: StockListProps) {
  return (
    <div className="glass-card p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Market Overview</h2>
        <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {stocks.map((stock) => {
          const isPositive = stock.priceChange >= 0;
          return (
            <div 
              key={stock.stockSymbol} 
              onClick={() => onSelect && onSelect(stock.stockSymbol)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center font-bold text-sm text-slate-300 border border-white/5 shadow-inner">
                  {stock.stockSymbol[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{stock.stockSymbol}</h4>
                  <p className="text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]" title={stock.companyNameEn || stock.companyNameVi}>
                    {stock.companyNameEn || stock.companyNameVi || stock.stockSymbol}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-slate-200">{stock.matchedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <div className={cn(
                  "flex items-center justify-end gap-1 text-xs font-medium mt-1",
                  isPositive ? "text-emerald-400" : "text-rose-400"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stock.priceChangePercent)}%
                </div>
              </div>
            </div>
          );
        })}
        {stocks.length === 0 && (
          <p className="text-sm text-slate-400">Loading stocks...</p>
        )}
      </div>
    </div>
  );
}

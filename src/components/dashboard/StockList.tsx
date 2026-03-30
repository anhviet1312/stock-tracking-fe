import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 1.25, isPositive: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 335.02, change: -0.85, isPositive: false },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 460.18, change: 2.34, isPositive: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.82, change: -1.42, isPositive: false },
  { symbol: 'AMZN', name: 'Amazon.com', price: 138.23, change: 0.75, isPositive: true },
  { symbol: 'META', name: 'Meta Platforms', price: 298.67, change: 1.12, isPositive: true },
];

export function StockList() {
  return (
    <div className="glass-card p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Top Movers</h2>
        <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center font-bold text-sm text-slate-300 border border-white/5 shadow-inner">
                {stock.symbol[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{stock.symbol}</h4>
                <p className="text-xs text-slate-500">{stock.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-slate-200">${stock.price.toFixed(2)}</p>
              <div className={cn(
                "flex items-center justify-end gap-1 text-xs font-medium mt-1",
                stock.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {stock.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stock.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

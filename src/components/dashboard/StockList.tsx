import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addFavouriteStock, removeFavouriteStock } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import type { StockTrackingInfo } from '../../lib/api';

interface StockListProps {
  stocks: StockTrackingInfo[];
  onSelect?: (symbol: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  favouriteSymbols?: string[];
  onFavouriteSuccess?: () => void;
}

export function StockList({ stocks, onSelect, isLoading, emptyMessage, favouriteSymbols = [], onFavouriteSuccess }: StockListProps) {
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const handleFavourite = async (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    
    const isFavourited = favouriteSymbols.includes(symbol);
    
    try {
      if (isFavourited) {
        await removeFavouriteStock(symbol);
        showToast(`Removed ${symbol} from favourites`, 'success');
      } else {
        await addFavouriteStock(symbol);
        showToast(`Added ${symbol} to favourites!`, 'success');
      }
      if (onFavouriteSuccess) onFavouriteSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to update favourite', 'error');
    }
  };

  return (
    <div className="glass-card p-6 border border-white/5 relative">
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={cn(
                "fixed bottom-8 right-8 px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl z-[100] text-white flex items-center gap-3 backdrop-blur-md border",
                toast.type === 'success' 
                  ? 'bg-emerald-500/80 border-emerald-500/20 shadow-emerald-500/20' 
                  : 'bg-rose-500/80 border-rose-500/20 shadow-rose-500/20'
              )}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
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
                {isAuthenticated && (() => {
                  const isFavourited = favouriteSymbols.includes(stock.stockSymbol);
                  return (
                    <button 
                      onClick={(e) => handleFavourite(e, stock.stockSymbol)} 
                      className={cn(
                        "p-2 transition-colors z-10 rounded-full hover:bg-white/5",
                        isFavourited ? "text-amber-400" : "text-slate-400 hover:text-amber-400"
                      )}
                      title={isFavourited ? "Favourited" : "Add to Favourites"}
                    >
                      <Star className="w-5 h-5" fill={isFavourited ? "currentColor" : "none"} />
                    </button>
                  );
                })()}
                <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center font-bold text-sm text-slate-300 border border-white/5 shadow-inner uppercase">
                  {stock.stockSymbol?.[0] || '?'}
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
        {isLoading && stocks.length === 0 && (
          <p className="text-sm text-slate-400">Loading stocks...</p>
        )}
        {!isLoading && stocks.length === 0 && (
          <p className="text-sm text-slate-400">{emptyMessage || 'No stocks available.'}</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Globe, BarChart2 } from 'lucide-react';
import { fetchStockInfo } from '../../lib/api';
import type { StockTrackingInfo } from '../../lib/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StockDetailProps {
  symbol: string;
  onClose: () => void;
}

export function StockDetail({ symbol, onClose }: StockDetailProps) {
  const [stock, setStock] = useState<StockTrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockInfo(symbol)
      .then((data) => {
        setStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [symbol]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (loading || !stock) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300">Loading {symbol} details...</p>
        </div>
      </div>
    );
  }

  const isPositive = stock.priceChange >= 0;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center p-0 md:p-6 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="glass-card w-full max-w-3xl rounded-t-3xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-1 pr-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 font-bold rounded-lg text-sm border border-primary-500/30 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  {stock.stockSymbol}
                </span>
                <span className="uppercase text-xs font-bold text-slate-400 tracking-wider">
                  {stock.exchange}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {stock.companyNameEn || stock.companyNameVi}
              </h2>
              
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {stock.matchedPrice.toLocaleString()}
                </span>
                <div className={cn(
                  "flex items-center gap-1.5 font-bold text-lg md:text-xl",
                  isPositive ? "text-emerald-400" : "text-rose-400"
                )}>
                  {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  {Math.abs(stock.priceChange)} ({Math.abs(stock.priceChangePercent)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 md:p-8 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricItem label="Ref Price" value={stock.refPrice.toLocaleString()} color="text-yellow-400" />
              <MetricItem label="Ceiling" value={stock.ceiling.toLocaleString()} color="text-fuchsia-400" />
              <MetricItem label="Floor" value={stock.floor.toLocaleString()} color="text-cyan-400" />
              <MetricItem label="Open" value={stock.openPrice.toLocaleString()} />
              <MetricItem label="High" value={stock.highest.toLocaleString()} color="text-emerald-400" />
              <MetricItem label="Low" value={stock.lowest.toLocaleString()} color="text-rose-400" />
              <MetricItem label="Avg Price" value={stock.avgPrice.toLocaleString()} />
              <MetricItem label="Bid/Ask Diff" value={Math.abs(stock.best1Offer - stock.best1Bid).toLocaleString()} />
            </div>

            {/* Order Book Grid */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                <BarChart2 className="w-5 h-5 text-fuchsia-400" />
                Order Book (Market Depth)
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {/* Bids */}
                <div>
                  <h4 className="text-emerald-400 font-bold mb-2 border-b border-white/10 pb-2 text-center text-sm uppercase tracking-wider">Bids (Mua)</h4>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 px-2">
                    <span>Volume</span>
                    <span>Price</span>
                  </div>
                  <BidRow price={stock.best3Bid} vol={stock.best3BidVol} />
                  <BidRow price={stock.best2Bid} vol={stock.best2BidVol} />
                  <BidRow price={stock.best1Bid} vol={stock.best1BidVol} />
                </div>
                {/* Asks */}
                <div>
                  <h4 className="text-rose-400 font-bold mb-2 border-b border-white/10 pb-2 text-center text-sm uppercase tracking-wider">Asks (Bán)</h4>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 px-2">
                    <span>Price</span>
                    <span>Volume</span>
                  </div>
                  <AskRow price={stock.best1Offer} vol={stock.best1OfferVol} />
                  <AskRow price={stock.best2Offer} vol={stock.best2OfferVol} />
                  <AskRow price={stock.best3Offer} vol={stock.best3OfferVol} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trading Volume & Value */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                  <BarChart2 className="w-5 h-5 text-primary-400" />
                  Trading Summary
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Total Volume</span>
                    <span className="font-bold text-white">{stock.nmTotalTradedQty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Total Value (VND)</span>
                    <span className="font-bold text-white text-right">
                      {stock.nmTotalTradedValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Buy Vol (Active)</span>
                    <span className="font-bold text-emerald-400 text-right">
                      {stock.stockBUVol.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Sell Vol (Active)</span>
                    <span className="font-bold text-rose-400 text-right">
                      {stock.stockSDVol.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Current Match Vol</span>
                    <span className="font-bold text-white">{stock.matchedVolume.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Foreign Trading */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Foreign Investors
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Foreign Buy Qty</span>
                    <span className="font-bold text-emerald-400">{stock.buyForeignQtty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-sm">Foreign Sell Qty</span>
                    <span className="font-bold text-rose-400">{stock.sellForeignQtty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Remain Room</span>
                    <span className="font-bold text-white">{stock.remainForeignQtty.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MetricItem({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="bg-dark-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
      <span className="text-xs text-slate-500 font-medium mb-1 tracking-wide uppercase">{label}</span>
      <span className={cn("text-lg font-bold truncate", color)}>{value}</span>
    </div>
  );
}

function BidRow({ price, vol }: { price: number, vol: number }) {
  return (
    <div className="flex justify-between py-1.5 px-2 hover:bg-white/5 rounded transition-colors border-b border-white/5 last:border-0">
      <span className="text-white text-sm">{vol === 0 ? '-' : vol.toLocaleString()}</span>
      <span className="text-emerald-400 font-bold">{price === 0 ? '-' : price.toLocaleString()}</span>
    </div>
  );
}

function AskRow({ price, vol }: { price: number, vol: number }) {
  return (
    <div className="flex justify-between py-1.5 px-2 hover:bg-white/5 rounded transition-colors border-b border-white/5 last:border-0">
      <span className="text-rose-400 font-bold">{price === 0 ? '-' : price.toLocaleString()}</span>
      <span className="text-white text-sm">{vol === 0 ? '-' : vol.toLocaleString()}</span>
    </div>
  );
}

import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
  isCurrency?: boolean;
}

export function StatCard({ title, value, change, icon, isCurrency = true }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      {/* Background glow effect on hover */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-dark-900/50 flex items-center justify-center border border-white/5 text-primary-400">
          {icon}
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
          isPositive 
            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" 
            : "text-rose-400 bg-rose-400/10 border-rose-400/20"
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">
          {isCurrency && <span className="text-slate-500 font-normal mr-1">$</span>}
          {value}
        </p>
      </div>
    </div>
  );
}

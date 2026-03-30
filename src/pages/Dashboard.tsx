import { DollarSign, Percent, Activity } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { PortfolioChart } from '../components/dashboard/PortfolioChart';
import { StockList } from '../components/dashboard/StockList';

export function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          Welcome back, Alex
        </h1>
        <p className="text-slate-400">
          Here is your portfolio overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Portfolio Value" 
          value="124,562.00" 
          change={2.4} 
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard 
          title="Daily Profit" 
          value="3,240.50" 
          change={1.2} 
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard 
          title="Top Gainer" 
          value="NVDA" 
          change={5.4} 
          icon={<Percent className="w-6 h-6" />}
          isCurrency={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioChart />
        <StockList />
      </div>
    </div>
  );
}

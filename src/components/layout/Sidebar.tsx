import { TrendingUp, PieChart, Activity, Settings, LayoutDashboard, Wallet, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: PieChart, label: 'Portfolio', active: false },
  { icon: Activity, label: 'Market', active: false },
  { icon: Wallet, label: 'Transactions', active: false },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <aside className="w-64 h-screen border-r border-white/10 glass flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Trackify
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              activeTab === item.label 
                ? "bg-primary-500/10 text-primary-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-2">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

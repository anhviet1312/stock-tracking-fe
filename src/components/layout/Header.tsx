import { Bell, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex relative group">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search stocks, ETFs..." 
            className="bg-dark-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-slate-500 text-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 border border-dark-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-200">Alex Investor</p>
            <p className="text-xs text-slate-400">Pro Member</p>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Alex+Investor&background=0D8ABC&color=fff&rounded=true" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-white/10"
          />
        </div>
      </div>
    </header>
  );
}

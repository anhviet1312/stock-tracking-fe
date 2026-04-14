import { Bell, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useState } from 'react';
import { LoginModal } from '../auth/LoginModal';
import { RegisterModal } from '../auth/RegisterModal';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <header className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 border border-dark-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          {isAuthenticated && user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200">{user.first_name || user.username}</p>
                <p className="text-xs text-slate-400">Pro Member</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 ml-2 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-white/5"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowRegister(true)}
                className="px-4 py-2 text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(20,184,166,0.2)]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </header>
  );
}

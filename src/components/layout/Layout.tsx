import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-900/20 blur-[120px]"></div>
          <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        </div>
        
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

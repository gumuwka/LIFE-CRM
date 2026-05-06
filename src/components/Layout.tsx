import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useApp } from '../AppContext';
import { Flame } from 'lucide-react';

export const Layout: React.FC<{ 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (tab: string) => void 
}> = ({ children, activeTab, setActiveTab }) => {
  const { streak } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-brand-active selection:bg-white selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-border sticky top-0 z-30">
          <h1 className="text-xl font-black uppercase tracking-tighter">Life <span className="text-brand-muted">CRM</span></h1>
          
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-orange-500/30">
            <span className="text-orange-500">
              <Flame size={16} className="fill-orange-500" />
            </span>
            <span className="text-sm font-black text-white">{streak.current}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-24 md:mb-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

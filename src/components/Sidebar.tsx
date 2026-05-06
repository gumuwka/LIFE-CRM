import React, { useState } from 'react';
import { 
  BarChart3, 
  HeartPulse, 
  Wallet, 
  Calendar, 
  LayoutDashboard, 
  Video, 
  CheckCircle2,
  Menu,
  X,
  Flame,
  StickyNote,
  User,
  FileText,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { streak } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Strona Główna', icon: LayoutDashboard },
    { id: 'routine', label: 'Rutyna', icon: Zap },
    { id: 'analytics', label: 'Analityka', icon: BarChart3 },
    { id: 'health', label: 'Zdrowie', icon: HeartPulse },
    { id: 'finance', label: 'Finanse', icon: Wallet },
    { id: 'reports', label: 'Raporty', icon: FileText },
    { id: 'tasks', label: 'Życie i Zadania', icon: CheckCircle2 },
    { id: 'notes', label: 'Notatki', icon: StickyNote },
    { id: 'calendar', label: 'Kalendarz', icon: Calendar },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className={cn(
        "h-screen glass border-r flex flex-col transition-all duration-300 hidden md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold tracking-tighter">LIFE <span className="text-brand-muted font-normal">CRM</span></h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-brand-muted hover:text-brand-active">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              activeTab === item.id 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-brand-muted hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={cn("p-6 border-t border-brand-border", collapsed ? "items-center" : "")}>
        <div className={cn("flex items-center gap-3 bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20", collapsed ? "justify-center" : "")}>
          <Flame className="text-orange-500 fill-orange-500" size={24} />
          {!collapsed && (
            <div>
              <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">STREAK</p>
              <p className="font-bold text-lg leading-none">{streak.current} Dni</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

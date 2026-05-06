import React, { useState } from 'react';
import { 
  HeartPulse, 
  Wallet, 
  Calendar, 
  LayoutDashboard, 
  Video, 
  CheckCircle2,
  StickyNote,
  Menu,
  X,
  User,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Główna' },
    { id: 'health', icon: HeartPulse, label: 'Zdrowie' },
    { id: 'tasks', icon: CheckCircle2, label: 'Zadania' },
    { id: 'finance', icon: Wallet, label: 'Finanse' },
  ];

  const menuItems = [
    { id: 'analytics', icon: BarChart3, label: 'Analityka' },
    { id: 'routine', icon: Zap, label: 'Rutyna' },
    { id: 'notes', icon: StickyNote, label: 'Notatki' },
    { id: 'calendar', icon: Calendar, label: 'Kalendarz' },
    { id: 'reports', icon: FileText, label: 'Raporty' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed bottom-24 left-4 right-4 z-50 glass rounded-3xl p-4 shadow-2xl border-white/10"
          >
            <div className="grid grid-cols-1 gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all",
                    activeTab === item.id ? "bg-white text-black" : "text-brand-muted hover:bg-white/5"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 glass rounded-3xl p-2 flex items-center justify-around shadow-2xl border-white/10">
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabSelect(item.id)}
            className={cn(
              "p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-1",
              activeTab === item.id 
                ? "bg-white text-black scale-110 shadow-lg" 
                : "text-brand-muted hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-1",
            isMenuOpen ? "bg-white text-black" : "text-brand-muted"
          )}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-[8px] font-black uppercase tracking-tighter">Więcej</span>
        </button>
      </nav>
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Plus, 
  Trash2, 
  Zap, 
  Settings,
  Smile,
  Moon,
  Sun,
  Flame,
  Wind,
  Search,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ICON_OPTIONS = [
  { name: 'Zap', icon: Zap },
  { name: 'Flame', icon: Flame },
  { name: 'Sun', icon: Sun },
  { name: 'Moon', icon: Moon },
  { name: 'Smile', icon: Smile },
  { name: 'Wind', icon: Wind },
  { name: 'CheckCircle2', icon: CheckCircle2 },
  { name: 'ListTodo', icon: ListTodo }
];

export const RoutineSection: React.FC = () => {
    const { routineItems, addRoutineItem, deleteRoutineItem } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Zap');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel.trim()) return;

        await addRoutineItem({
            label: newLabel,
            iconName: selectedIcon
        });

        setIsAdding(false);
        setNewLabel('');
        setSelectedIcon('Zap');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Twoja Rutyna</h2>
                    <p className="text-brand-muted font-medium">Skonfiguruj powtarzalne nawyki, które budują Twój dzień.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                    <Plus size={18} />
                    Dodaj Nawyk
                </button>
            </div>

            {/* List of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {routineItems.map((item) => {
                        const Icon = ICON_OPTIONS.find(i => i.name === item.iconName)?.icon || Zap;
                        return (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id}
                                className="glass p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{item.label}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Codzienny Nawyk</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteRoutineItem(item.id)}
                                    className="p-3 text-brand-muted hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {routineItems.length === 0 && !isAdding && (
                <div className="glass p-20 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <ListTodo size={48} className="text-brand-muted" />
                    <div>
                        <h4 className="text-xl font-bold uppercase tracking-tight">Brak nawyków</h4>
                        <p className="text-sm font-medium text-brand-muted">Skonfiguruj swoją rutynę, aby łatwiej śledzić postępy.</p>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <div className="glass w-full max-w-lg rounded-[3rem] p-8 border border-white/10 relative">
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="absolute top-6 right-6 p-2 text-brand-muted hover:text-white transition-colors"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Dodaj Nowy Nawyk</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted">Nazwa Nawyku</label>
                                    <input 
                                        autoFocus
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                        placeholder="np. Picie wody, Medytacja..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted">Wybierz Ikonę</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {ICON_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.name}
                                                type="button"
                                                onClick={() => setSelectedIcon(opt.name)}
                                                className={cn(
                                                    "p-4 rounded-2xl border transition-all flex items-center justify-center",
                                                    selectedIcon === opt.name 
                                                        ? "bg-white text-black border-white" 
                                                        : "bg-white/5 text-brand-muted border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                <opt.icon size={24} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Zapisz Nawyk
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

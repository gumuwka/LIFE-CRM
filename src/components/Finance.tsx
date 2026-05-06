import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  Car, 
  Bitcoin, 
  Plus, 
  Minus,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const FinanceSection: React.FC = () => {
  const { financeGoals, updateFinanceGoal } = useApp();
  const [transactionAmount, setTransactionAmount] = useState<string>('500');

  const totalSaved = (financeGoals || []).reduce((acc, g) => acc + g.current, 0);
  const monthlyGoal = 1500;
  const monthlyProgress = Math.min((totalSaved / monthlyGoal) * 100, 100);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('samochód')) return <Car size={24} />;
    if (n.includes('crypto')) return <Bitcoin size={24} />;
    return <PiggyBank size={24} />;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Finanse i Inwestycje</h2>
        <p className="text-brand-muted">Zarządzaj swoimi oszczędnościami i dąż do wolności finansowej.</p>
      </div>

      {/* Main Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 to-transparent flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
                <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Suma Aktywów</p>
                <p className="text-3xl md:text-5xl font-mono font-bold tracking-tighter">{totalSaved.toLocaleString()} <span className="text-lg md:text-xl font-normal opacity-50">PLN</span></p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500">
                <Wallet size={32} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
                <span className="text-brand-muted lowercase italic">Progress miesięczny</span>
                <span>{monthlyProgress.toFixed(0)}% celu (1500 PLN)</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${monthlyProgress}%` }}
                    className="h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                />
            </div>
          </div>
        </div>

        <div className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6 flex flex-col justify-center min-h-[220px]">
            <h3 className="font-bold text-center uppercase text-sm tracking-widest text-brand-muted">Szybka Wpłata</h3>
            <div className="w-full">
                <input 
                    type="text"
                    inputMode="decimal"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full bg-white/5 border border-brand-border rounded-2xl px-4 py-3 text-xl md:text-2xl font-mono font-bold text-center focus:ring-2 focus:ring-yellow-500/20 focus:outline-none"
                    placeholder="0"
                />
            </div>
            <p className="text-[10px] text-center text-brand-muted leading-tight px-2">
                Wybierz cel poniżej, aby dodać zapisaną kwotę ({transactionAmount} PLN) do swojej bazy.
            </p>
        </div>
      </div>

      {/* Finance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(financeGoals || []).map((goal) => (
          <div key={goal.id} className="glass p-6 rounded-3xl space-y-6 card-hover group h-full flex flex-col">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-2xl text-brand-muted group-hover:text-yellow-500 transition-colors">
                    {getIcon(goal.name)}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold font-mono tracking-tighter">{goal.current.toLocaleString()}</span>
                    <span className="text-[10px] text-brand-muted uppercase font-black">PLN</span>
                </div>
            </div>
            
            <div className="flex-1">
                <h4 className="text-xl font-bold mb-1">{goal.name}</h4>
                <p className="text-sm text-brand-muted line-clamp-2 italic leading-snug">{goal.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-border">
                <div className="flex gap-2">
                    <button 
                        onClick={() => updateFinanceGoal(goal.id, Number(transactionAmount))}
                        className="flex-1 bg-white text-black py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all text-sm"
                    >
                        <Plus size={16} />
                        Wpłać
                    </button>
                    <button 
                        onClick={() => updateFinanceGoal(goal.id, -Number(transactionAmount))}
                        className="flex-1 bg-brand-border py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-sm"
                    >
                        <Minus size={16} />
                        Wypłać
                    </button>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-brand-muted uppercase tracking-widest pt-2">
                    <div className="flex items-center gap-2">
                        <Target size={12} />
                        Cel: {goal.target.toLocaleString()}
                    </div>
                    <div>
                        {((goal.current / goal.target) * 100).toFixed(0)}%
                    </div>
                </div>
            </div>
          </div>
        ))}

        {/* Add new goal button */}
        <button className="border-2 border-dashed border-brand-border rounded-3xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-brand-active hover:bg-white/5 transition-all min-h-[280px]">
            <div className="p-4 rounded-full bg-brand-border group-hover:bg-white group-hover:text-black transition-all">
                <Plus size={32} />
            </div>
            <div className="text-center">
                <p className="font-bold">Dodaj Nowy Cel</p>
                <p className="text-xs text-brand-muted">Mieszkanie, Sprzęt, Wakacje...</p>
            </div>
        </button>
      </div>

      {/* Projections/Advice Banner */}
      <div className="bg-white/5 border border-brand-border p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500">
            <ArrowUpRight size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-lg leading-tight uppercase tracking-tighter">Planer Finansowy: Oskar</h4>
            <p className="text-brand-muted text-sm italic">"Pamiętaj Oskar, oszczędność to nie rezygnacja z życia, tylko kupowanie przyszłego spokoju. Dziś odkładasz 500 PLN, jutro kupujesz wolność."</p>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Następna Wypłata</p>
            <p className="text-xl font-bold font-mono">10.05.2024</p>
        </div>
      </div>
    </div>
  );
};

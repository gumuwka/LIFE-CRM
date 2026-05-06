import React from 'react';
import { useApp } from '../AppContext';
import { 
  Flame, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Calendar as CalendarIcon,
  Video,
  HeartPulse,
  Wallet,
  StickyNote,
  CheckCircle2,
  Zap,
  Star,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  Wind,
  ListTodo,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, any> = {
  Zap, Flame, Sun, Moon, Star, ShieldCheck, Wind, CheckCircle2, ListTodo, FileText
};

const ProgressBar = ({ value, max, label, colorClass }: { value: number, max: number, label: string, colorClass: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-brand-muted">{label}</span>
        <span className="text-sm font-bold">{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-brand-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full transition-all duration-1000", colorClass)}
        />
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { profile, tasks, updateTask, addTask, healthLogs, financeGoals, streak, notes, addNote, routineItems, routineCompletion, toggleRoutineCompletion } = useApp();
  
  const currentMonth = new Date().getMonth();
  const currentMonthLogs = healthLogs.filter(log => new Date(log.date).getMonth() === currentMonth);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = (tasks || []).filter(t => !t.completed && (t.dueDate === today || !t.dueDate)).slice(0, 3);
  const completedRoutineIds = routineCompletion[today] || [];

  const stats = {
    walks: currentMonthLogs.reduce((acc, log) => acc + log.walks, 0),
    diet: currentMonthLogs.filter(log => log.dietDays).length,
    sleep: currentMonthLogs.filter(log => log.sleep8h).length,
    savings: financeGoals.reduce((acc, g) => acc + g.current, 0),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cześć, {profile.name}</h2>
          <p className="text-brand-muted">Twój dzisiejszy przegląd aktywności.</p>
        </div>
      </div>

      {/* Daily Routine & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Routine */}
        <div className="glass p-8 rounded-[2.5rem] border border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Dzienna Rutyna
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Dzisiaj</span>
          </div>
          <div className="space-y-3">
            {routineItems.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Zap;
              const isCompleted = completedRoutineIds.includes(item.id);
              
              return (
                <button 
                  key={item.id} 
                  onClick={() => toggleRoutineCompletion(item.id, today)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                    isCompleted 
                      ? "bg-green-500/10 border-green-500/30 text-green-400" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-xl border transition-all",
                      isCompleted ? "bg-green-500 text-black border-green-500" : "bg-brand-bg border-brand-border group-hover:scale-110"
                    )}>
                      <Icon size={18} className={isCompleted ? "text-black" : "text-brand-muted"} />
                    </div>
                    <span className={cn("font-bold", isCompleted && "line-through opacity-50")}>{item.label}</span>
                  </div>
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-black" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-brand-border group-hover:border-white/20" />
                  )}
                </button>
              );
            })}
            {routineItems.length === 0 && (
              <div className="text-center py-6 text-brand-muted opacity-50 italic text-sm">
                Brak zdefiniowanych nawyków.
              </div>
            )}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="glass p-8 rounded-[2.5rem] border border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-500" />
              Twoje Zadania
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Do zrobienia</span>
          </div>
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => updateTask(task.id, { completed: true })}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                      <div className="w-4 h-4 rounded-sm border-2 border-brand-muted group-hover:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold group-hover:text-blue-400 transition-colors">{task.title}</p>
                      <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">{task.type}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-brand-muted" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-brand-muted space-y-2 opacity-50">
                <CheckCircle2 size={32} />
                <p className="text-sm font-bold uppercase tracking-widest">Wszystko gotowe!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Health Goals */}
        <div className="glass p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-green-400">
            <HeartPulse size={20} />
            <h3 className="font-bold">Zdrowie</h3>
          </div>
          <ProgressBar value={stats.walks} max={15} label="Spacery" colorClass="bg-green-500" />
          <ProgressBar value={stats.diet} max={25} label="Dobra Dieta" colorClass="bg-emerald-500" />
        </div>

        {/* Finance Goals */}
        <div className="glass p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-yellow-400">
            <Wallet size={20} />
            <h3 className="font-bold">Portfel</h3>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-brand-muted uppercase font-bold tracking-widest">Suma Oszczędności</p>
            <p className="text-4xl font-mono font-bold tracking-tighter">{stats.savings.toLocaleString()} <span className="text-xl font-normal opacity-50">PLN</span></p>
          </div>
          <ProgressBar value={stats.savings} max={1500} label="Cel miesięczny (1500)" colorClass="bg-yellow-500" />
        </div>
      </div>

      {/* Weekly Mini Planner Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="text-brand-muted" size={24} />
                    <h3 className="text-xl font-bold">Nadchodzący Tydzień</h3>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isToday = i === 0;
                    return (
                        <div key={i} className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border transition-all aspect-square text-center",
                            isToday ? "bg-white text-black border-white" : "border-brand-border bg-white/5 hover:bg-white/10"
                        )}>
                            <p className={cn("text-[8px] font-black uppercase tracking-tighter", isToday ? "text-black/60" : "text-brand-muted")}>
                                {date.toLocaleDateString('pl-PL', { weekday: 'short' })}
                            </p>
                            <p className="text-lg font-black leading-none">{date.getDate()}</p>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <StickyNote className="text-brand-muted" size={24} />
                    <h3 className="text-xl font-bold">Szybkie Notatki</h3>
                </div>
                <button 
                  onClick={() => addNote({ title: 'Szybka Notatka', content: '', color: 'bg-white/5' })}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white transition-all"
                >
                    <Plus size={18} />
                </button>
            </div>
            <div className="flex-1 space-y-3">
                {(notes || []).slice(0, 3).map(note => (
                    <div key={note.id} className="p-3 bg-white/5 rounded-2xl border border-brand-border hover:border-brand-muted/30 transition-all cursor-pointer">
                        <p className="text-sm font-bold truncate">{note.title || 'Bez tytułu'}</p>
                        <p className="text-xs text-brand-muted truncate mt-1">{note.content || 'Brak treści...'}</p>
                    </div>
                ))}
                {notes.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-brand-muted opacity-30 italic text-sm">
                        <p>Brak notatek</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

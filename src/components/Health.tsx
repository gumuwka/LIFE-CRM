import React from 'react';
import { useApp } from '../AppContext';
import { 
  HeartPulse, 
  Moon, 
  Utensils, 
  Footprints, 
  History,
  CheckCircle2,
  XCircle,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const HealthCard = ({ icon, title, count, total, unit, colorClass }: any) => {
  const percentage = Math.min((count / total) * 100, 100);
  return (
    <div className="glass p-6 rounded-3xl space-y-4">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-2xl bg-white/5", colorClass)}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{count}<span className="text-sm font-normal text-brand-muted opacity-50 ml-1">{unit}</span></p>
          <p className="text-xs text-brand-muted font-bold uppercase tracking-widest">Postęp Miesięczny</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-1">{title}</h4>
        <div className="h-1.5 w-full bg-brand-border rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn("h-full", colorClass.split(' ')[0].replace('text-', 'bg-'))}
          />
        </div>
        <p className="text-[10px] text-right mt-1 text-brand-muted font-bold">CEL: {total} {unit}</p>
      </div>
    </div>
  );
};

export const HealthSection: React.FC = () => {
  const { healthLogs, addHealthLog } = useApp();
  
  const today = new Date().toISOString().split('T')[0];
  const todayLog = (healthLogs || []).find(l => l.date === today) || { date: today, walks: 0, dietDays: false, sleep8h: false };

  const currentMonthLogs = (healthLogs || []).filter(l => new Date(l.date).getMonth() === new Date().getMonth());
  
  const stats = {
    walks: currentMonthLogs.reduce((acc, l) => acc + l.walks, 0),
    diet: currentMonthLogs.filter(l => l.dietDays).length,
    sleep: currentMonthLogs.filter(l => l.sleep8h).length,
  };

  const handleUpdateToday = (field: keyof typeof todayLog, value: any) => {
    addHealthLog({ ...todayLog, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Zdrowie i Kondycja</h2>
        <p className="text-brand-muted">Kluczowe filtry Twojego samopoczucia.</p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthCard 
          icon={<Footprints size={24} />} 
          title="Spacery (Cel 15)" 
          count={stats.walks} 
          total={15} 
          unit="dni" 
          colorClass="text-green-400" 
        />
        <HealthCard 
          icon={<Utensils size={24} />} 
          title="Dobra Dieta (Cel 25)" 
          count={stats.diet} 
          total={25} 
          unit="dni" 
          colorClass="text-emerald-400" 
        />
        <HealthCard 
          icon={<Moon size={24} />} 
          title="Sen 8h (Cel 20)" 
          count={stats.sleep} 
          total={20} 
          unit="dni" 
          colorClass="text-indigo-400" 
        />
      </div>

      {/* Today's Log */}
      <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <HeartPulse size={120} className="text-white" />
        </div>
        
        <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                Loguj Dzisiejszy Dzień <span className="text-sm font-normal text-brand-muted px-2 py-0.5 rounded-full bg-white/5">{today}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Walk counter */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Spacery (1h+)</p>
                    <div className="flex items-center gap-4 bg-white/5 border border-brand-border p-4 rounded-2xl">
                        <button 
                            onClick={() => handleUpdateToday('walks', Math.max(0, todayLog.walks - 1))}
                            className="bg-brand-border p-2 rounded-lg hover:bg-white/10"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="flex-1 text-center font-mono text-2xl font-bold">{todayLog.walks}</span>
                        <button 
                            onClick={() => handleUpdateToday('walks', todayLog.walks + 1)}
                            className="bg-brand-border p-2 rounded-lg hover:bg-white/10"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Diet toggle */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Czysta Dieta</p>
                    <button 
                        onClick={() => handleUpdateToday('dietDays', !todayLog.dietDays)}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all h-[70px]",
                            todayLog.dietDays ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-brand-border text-brand-muted"
                        )}
                    >
                        <span className="font-bold">{todayLog.dietDays ? 'Zrealizowane' : 'Loguj Dietę'}</span>
                        {todayLog.dietDays ? <CheckCircle2 size={24} /> : <XCircle size={24} className="opacity-20" />}
                    </button>
                </div>

                {/* Sleep toggle */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Sen 8 Godzin</p>
                    <button 
                        onClick={() => handleUpdateToday('sleep8h', !todayLog.sleep8h)}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all h-[70px]",
                            todayLog.sleep8h ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-brand-border text-brand-muted"
                        )}
                    >
                        <span className="font-bold">{todayLog.sleep8h ? 'Zrealizowane' : 'Loguj Sen'}</span>
                        {todayLog.sleep8h ? <CheckCircle2 size={24} /> : <XCircle size={24} className="opacity-20" />}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* History List */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center gap-2">
            <History size={18} className="text-brand-muted" />
            <h3 className="font-bold uppercase text-sm tracking-widest">Ostatnia Aktywność</h3>
        </div>
        <div className="max-h-60 overflow-y-auto">
            {(healthLogs || []).slice().reverse().slice(0, 7).map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-brand-border last:border-0 hover:bg-white/5">
                    <span className="text-sm font-medium">{log.date}</span>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1">
                            <Footprints size={14} className="text-green-500" />
                            <span className="text-xs font-bold">{log.walks}</span>
                        </div>
                        {log.dietDays && <Utensils size={14} className="text-emerald-500" />}
                        {log.sleep8h && <Moon size={14} className="text-indigo-500 shadow-sm" />}
                    </div>
                </div>
            ))}
            {healthLogs.length === 0 && <div className="p-8 text-center text-brand-muted italic">Brak wpisów w historii.</div>}
        </div>
      </div>
    </div>
  );
};

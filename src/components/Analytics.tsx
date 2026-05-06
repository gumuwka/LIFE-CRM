import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Wallet, 
  Smile, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { format, subDays, isAfter, startOfDay, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export const AnalyticsSection: React.FC = () => {
  const { reports, tasks, healthLogs, financeGoals, routineCompletion, routineItems } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date | null = null;
    
    if (timeRange === '7d') startDate = subDays(now, 7);
    else if (timeRange === '30d') startDate = subDays(now, 30);
    else if (timeRange === '90d') startDate = subDays(now, 90);

    const filterByDate = (dateStr: string) => {
      if (!startDate) return true;
      return isAfter(parseISO(dateStr), startOfDay(startDate));
    };

    const fReports = reports.filter(r => filterByDate(r.date));
    const fTasks = tasks.filter(t => t.completed); 
    const fHealthLogs = healthLogs.filter(l => filterByDate(l.date));

    // Routine Analytics
    const routineCompletionDates = Object.keys(routineCompletion).filter(filterByDate);
    const totalPossibleRoutineChecks = routineCompletionDates.length * routineItems.length;
    const actualRoutineChecks = routineCompletionDates.reduce((acc, date) => acc + routineCompletion[date].length, 0);
    const routineCompletionRate = totalPossibleRoutineChecks > 0 
      ? Math.round((actualRoutineChecks / totalPossibleRoutineChecks) * 100)
      : 0;

    // Prepare chart data for Satisfaction
    const satisfactionChart = fReports
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({
        name: format(parseISO(r.date), 'dd.MM', { locale: pl }),
        value: r.rating
      }));

    // Prepare chart data for Routine (Walks as example)
    const routineChart = fHealthLogs
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(l => ({
        name: format(parseISO(l.date), 'dd.MM', { locale: pl }),
        steps: l.walks,
        diet: l.dietDays ? 1 : 0,
        sleep: l.sleep8h ? 1 : 0
      }));

    const totalSatisfaction = fReports.length > 0 
      ? (fReports.reduce((acc, r) => acc + r.rating, 0) / fReports.length).toFixed(1)
      : '0';

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const totalSavings = financeGoals.reduce((acc, g) => acc + g.current, 0);

    return {
      satisfactionChart,
      routineChart,
      totalSatisfaction,
      completedTasksCount,
      totalSavings,
      reportsCount: fReports.length,
      routineDaysCount: fHealthLogs.length,
      routineCompletionRate
    };
  }, [reports, tasks, healthLogs, financeGoals, timeRange, routineCompletion, routineItems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Analityka Twojego Życia</h2>
          <p className="text-brand-muted font-medium">Monitoruj postępy i optymalizuj codzienność.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-[1.25rem] border border-white/5">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                timeRange === range 
                  ? "bg-white text-black shadow-lg" 
                  : "text-brand-muted hover:text-white"
              )}
            >
              {range === 'all' ? 'Wszystko' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Zadowolenie', value: filteredData.totalSatisfaction, suffix: '/10', icon: Smile, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Zakończone Zadania', value: filteredData.completedTasksCount, suffix: '', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Suma Oszczędności', value: filteredData.totalSavings, suffix: ' PLN', icon: Wallet, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Rutyna (Skuteczność)', value: filteredData.routineCompletionRate, suffix: '%', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass p-6 rounded-[2rem] border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-green-400">
                <ArrowUpRight size={10} />
                <span>+12%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">{stat.label}</p>
              <h4 className="text-2xl font-black">{stat.value}<span className="text-sm text-brand-muted font-bold">{stat.suffix}</span></h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Chart */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Poziom Zadowolenia</h3>
              <p className="text-xs font-medium text-brand-muted">Średnia ocen z Twoich raportów.</p>
            </div>
            <Smile size={24} className="text-yellow-400" />
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.satisfactionChart}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facd11" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#facd11" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  domain={[0, 10]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    borderRadius: '16px', 
                    border: '1px solid #ffffff10',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#facd11" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Routine Progress Chart */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Aktywność (Kroki)</h3>
              <p className="text-xs font-medium text-brand-muted">Liczba kroków w ostatnim czasie.</p>
            </div>
            <TrendingUp size={24} className="text-blue-400" />
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.routineChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    borderRadius: '16px', 
                    border: '1px solid #ffffff10',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="steps" radius={[10, 10, 0, 0]}>
                  {filteredData.routineChart.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.steps >= 10000 ? '#4ade80' : '#3b82f6'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Finance Progress */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tight">Twoje Cele Finansowe</h3>
          <Wallet size={24} className="text-green-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {financeGoals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-brand-muted">{goal.name}</p>
                  <p className="font-bold">{goal.current} / {goal.target} PLN</p>
                </div>
                <span className="text-xs font-black text-green-400">{Math.round((goal.current / goal.target) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

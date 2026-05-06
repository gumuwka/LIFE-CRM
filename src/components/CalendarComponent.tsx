import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Plus,
  Flame,
  Star,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';

export const CalendarSection: React.FC = () => {
    const { streak, tasks, healthLogs } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'agenda' | 'month'>('month');

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { locale: pl });
    const endDate = endOfWeek(monthEnd, { locale: pl });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // For the week picker (agenda mode)
    const weekStart = startOfWeek(selectedDate, { locale: pl });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const dayNames = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

    const getDayTasks = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return (tasks || []).filter(t => t.dueDate === dateStr || (isSameDay(date, new Date()) && !t.dueDate));
    };

    const getDayStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return streak.history[dateStr];
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter capitalize">
                        {format(currentDate, 'MMMM', { locale: pl })}
                        <span className="text-brand-muted font-normal ml-2">{format(currentDate, 'yyyy')}</span>
                    </h2>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-brand-border">
                    <button 
                        onClick={() => setViewMode('agenda')}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", viewMode === 'agenda' ? "bg-white text-black" : "text-brand-muted")}
                    >
                        Dzień
                    </button>
                    <button 
                        onClick={() => setViewMode('month')}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", viewMode === 'month' ? "bg-white text-black" : "text-brand-muted")}
                    >
                        Miesiąc
                    </button>
                </div>
            </div>

            {viewMode === 'agenda' ? (
                <div className="space-y-8">
                    {/* Horizontal Week Picker */}
                    <div className="flex justify-between items-center bg-brand-card p-4 rounded-[2rem] border border-brand-border shadow-2xl">
                        {weekDays.map((day, i) => {
                            const isSelected = isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, new Date());
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(day)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-2 rounded-2xl transition-all w-12",
                                        isSelected ? "bg-white text-black scale-110 shadow-xl" : "text-brand-muted hover:bg-white/5"
                                    )}
                                >
                                    <span className={cn("text-[10px] font-black uppercase tracking-tighter", isSelected ? "text-black/60" : "text-brand-muted")}>
                                        {format(day, 'eee', { locale: pl })}
                                    </span>
                                    <span className="text-lg font-black leading-none">
                                        {format(day, 'd')}
                                    </span>
                                    {isToday && !isSelected && <div className="w-1 h-1 bg-white rounded-full" />}
                                </button>
                            )
                        })}
                    </div>

                    {/* Day Agenda View */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <CalendarIcon size={20} className="text-brand-muted" />
                                {isSameDay(selectedDate, new Date()) ? "Dzisiaj" : format(selectedDate, 'd MMMM', { locale: pl })}
                            </h3>
                            <button className="p-2 bg-white/5 rounded-xl border border-brand-border hover:bg-white/10">
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Health/Streak Stat for the day */}
                            {getDayStatus(selectedDate) && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-orange-500 rounded-xl">
                                        <Flame size={20} className="text-white fill-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Dzień Zaliczony!</p>
                                        <p className="text-xs text-brand-muted uppercase font-bold tracking-widest">Rutyna wykonana w 100%</p>
                                    </div>
                                </div>
                            )}

                            {/* Tasks for the day */}
                            {getDayTasks(selectedDate).length > 0 ? (
                                getDayTasks(selectedDate).map((task) => (
                                    <div key={task.id} className="glass p-5 rounded-3xl flex items-center gap-4">
                                        <div className={cn("w-2 h-10 rounded-full", task.completed ? "bg-brand-border" : "bg-white")} />
                                        <div className="flex-1">
                                            <p className={cn("font-bold text-lg", task.completed && "line-through text-brand-muted")}>{task.title}</p>
                                            <p className="text-xs text-brand-muted uppercase font-bold tracking-widest">{task.type}</p>
                                        </div>
                                        <CheckCircle2 className={cn(task.completed ? "text-white" : "text-brand-border")} size={24} />
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-brand-border">
                                    <p className="text-brand-muted italic font-mono">Brak zadań na ten dzień.</p>
                                    <button className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white underline">Dodaj coś</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Month Grid View (Original refreshed for desktop/deep UI) */
                <div className="glass rounded-[2rem] overflow-hidden border">
                    <div className="grid grid-cols-7 border-b border-brand-border bg-white/5">
                        {dayNames.map(day => (
                            <div key={day} className="py-4 text-center text-xs font-black uppercase tracking-widest text-brand-muted opacity-50">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, idx) => {
                            const isToday = isSameDay(day, new Date());
                            const isInMonth = isSameMonth(day, monthStart);
                            const checkInStatus = getDayStatus(day);
                            const isSel = isSameDay(day, selectedDate);

                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => { setSelectedDate(day); setViewMode('agenda'); }}
                                    className={cn(
                                        "min-h-[80px] md:min-h-[120px] p-2 border-r border-b border-brand-border last:border-r-0 transition-all cursor-pointer hover:bg-white/[0.02]",
                                        !isInMonth && "opacity-20 bg-black/20",
                                        isSel && "bg-white/[0.05]"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={cn(
                                            "w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs",
                                            isToday ? "bg-white text-black" : isSel ? "bg-white/20 text-white" : "text-brand-active"
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                        {checkInStatus === 'FULL' && (
                                            <Flame size={12} className="text-orange-500 fill-orange-500" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

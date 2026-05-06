import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar as CalendarIcon, 
  Gift, 
  MoreVertical,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Task } from '../types';

export const TasksSection: React.FC = () => {
  const { tasks, addTask, updateTask } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const lifeTasks = (tasks || []).filter(t => t.type === 'life');
  const birthdays = [
    { name: 'Mama', date: '15.05', type: 'birthday' },
    { name: 'Siostra', date: '22.06', type: 'birthday' },
    { name: 'Babcia', date: '04.09', type: 'nameday' },
  ];

  const handleAddTask = async () => {
    if (!newTaskTitle) return;
    await addTask({
      title: newTaskTitle,
      type: 'life',
      completed: false,
      subtasks: []
    });
    setNewTaskTitle('');
  };

  const toggleTask = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Życie i Zadania</h2>
          <p className="text-brand-muted">Małe kroki, które budują Twój spokój.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2">
            <input 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Dodaj nowe zadanie (np. Napompować koła w rowerze)..."
              className="flex-1 bg-white/5 border border-brand-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
            />
            <button 
              onClick={handleAddTask}
              className="bg-white text-black p-4 rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 opacity-50 px-2 flex items-center gap-2">
                <ClipboardList size={16} />
                Twoja Lista
            </h3>
            {lifeTasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "glass p-5 rounded-3xl flex items-center gap-4 transition-all group border-l-4",
                  task.completed ? "opacity-50 border-white/20" : "border-white/40 hover:-translate-y-0.5"
                )}
              >
                <button 
                  onClick={() => toggleTask(task)}
                  className="text-brand-muted hover:text-white transition-colors"
                >
                  {task.completed ? <CheckCircle2 className="text-white" size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1">
                  <p className={cn("font-bold text-lg leading-tight", task.completed && "line-through text-brand-muted")}>
                    {task.title}
                  </p>
                  {task.dueDate && <span className="text-[10px] text-brand-muted font-bold">{task.dueDate}</span>}
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-xl text-brand-muted transition-all">
                    <MoreVertical size={18} />
                </button>
              </div>
            ))}
            {lifeTasks.length === 0 && (
                <div className="text-center py-20 bg-white/5 border border-brand-border rounded-3xl">
                    <p className="text-brand-muted font-mono italic">Pusto tutaj. Zaplanuj coś!</p>
                </div>
            )}
          </div>
        </div>

        {/* Sidebar: Dates & Deadlines */}
        <div className="space-y-8">
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Gift size={20} className="text-pink-400" />
                    Ważne Daty
                </h3>
                <div className="space-y-4">
                    {birthdays.map((b, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-400/10 flex items-center justify-center text-pink-400">
                                    <Gift size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{b.name} <span className="text-[10px] text-brand-muted uppercase font-normal ml-1">({b.type === 'birthday' ? 'Urodziny' : 'Imieniny'})</span></p>
                                    <p className="text-xs text-brand-muted leading-none">{b.date}</p>
                                </div>
                            </div>
                            <ChevronRight size={14} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
                <button className="w-full py-2 bg-pink-400/10 text-pink-400 rounded-xl font-bold text-xs hover:bg-pink-400/20 transition-all">DODAJ DATĘ</button>
            </div>

            <div className="glass p-8 rounded-[2.5rem] space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-brand-muted">
                    <CalendarIcon size={20} />
                    Dziś w planie
                </h3>
                <div className="p-4 bg-brand-border/50 rounded-2xl border border-brand-border">
                    <p className="text-sm font-medium">Uzupełnić CRM!</p>
                    <p className="text-xs text-brand-muted italic mt-1">To jedyna droga do celu.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

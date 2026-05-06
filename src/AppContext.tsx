import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Task, HealthLog, FinanceGoal, Note, DailyReport, RoutineItem } from './types';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './lib/firebaseErrors';
import { useAuth } from './AuthContext';

const DEFAULT_STATE: AppState = {
  profile: {
    name: "Użytkownik",
    level: 1,
    xp: 0,
    maxXp: 1000,
    bio: "Twój osobisty asystent rozwoju."
  },
  tasks: [],
  healthLogs: [],
  financeGoals: [
    { id: "1", name: "Oszczędności", target: 5000, current: 1200, description: "Fundusz awaryjny" },
    { id: "2", name: "Samochód", target: 20000, current: 500, description: "Pierwsze auto" },
    { id: "3", name: "Crypto", target: 10000, current: 0, description: "Inwestycje" }
  ],
  notes: [],
  reports: [],
  routineItems: [
    { id: "1", label: "Medytacja", iconName: "Zap" },
    { id: "2", label: "Czytanie (15 min)", iconName: "FileText" },
    { id: "3", label: "Zimny prysznic", iconName: "Wind" },
    { id: "4", label: "Planowanie jutra", iconName: "Calendar" }
  ],
  routineCompletion: {},
  streak: { current: 0, lastCheckIn: null, history: {} }
};

interface AppContextType extends AppState {
  updateProfile: (updates: Partial<AppState['profile']>) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  addHealthLog: (log: HealthLog) => Promise<void>;
  updateFinanceGoal: (id: string, amount: number) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addReport: (report: Omit<DailyReport, 'id' | 'createdAt'>) => Promise<void>;
  addRoutineItem: (item: Omit<RoutineItem, 'id'>) => Promise<void>;
  deleteRoutineItem: (id: string) => Promise<void>;
  toggleRoutineCompletion: (itemId: string, date: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState | null>(null);
  const { user } = useAuth();

  const fetchState = useCallback(async () => {
    if (!user) {
      setState(null);
      return;
    }
    const docRef = doc(db, 'users', user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as AppState;
        setState(data);
      } else {
        // First time user initialization
        const initialState = { ...DEFAULT_STATE };
        initialState.profile.name = user.username;
        await setDoc(docRef, { ...initialState, updatedAt: serverTimestamp() });
        setState(initialState);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
    }
  }, [user]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const saveState = async (newState: AppState) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    try {
      await setDoc(docRef, { ...newState, updatedAt: serverTimestamp() });
      setState(newState);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  if (!user) return <>{children}</>;

  if (!state) {
    return (
      <div className="bg-[#0c0c0e] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-brand-muted text-xs font-black uppercase tracking-widest">Inicjalizacja danych...</p>
        </div>
      </div>
    );
  }

  const updateProfile = async (updates: Partial<AppState['profile']>) => {
    const newState = {
      ...state,
      profile: { ...state.profile, ...updates }
    };
    await saveState(newState);
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9) };
    const newState = { ...state, tasks: [...state.tasks, newTask] };
    await saveState(newState);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const newState = {
      ...state,
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    };
    await saveState(newState);
  };

  const addHealthLog = async (log: HealthLog) => {
    const newState = {
      ...state,
      healthLogs: [...state.healthLogs.filter(l => l.date !== log.date), log]
    };
    await saveState(newState);
  };

  const updateFinanceGoal = async (id: string, amount: number) => {
    const newState = {
      ...state,
      financeGoals: state.financeGoals.map(g => g.id === id ? { ...g, current: g.current + amount } : g)
    };
    await saveState(newState);
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = { ...state, notes: [newNote, ...state.notes] };
    await saveState(newState);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const newState = {
      ...state,
      notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
    };
    await saveState(newState);
  };

  const deleteNote = async (id: string) => {
    const newState = {
      ...state,
      notes: state.notes.filter(n => n.id !== id)
    };
    await saveState(newState);
  };

  const addReport = async (report: Omit<DailyReport, 'id' | 'createdAt'>) => {
    const newReport: DailyReport = {
      ...report,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      ...state,
      reports: [newReport, ...state.reports]
    };
    await saveState(newState);
  };

  const addRoutineItem = async (item: Omit<RoutineItem, 'id'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 11)
    };
    const newState = {
      ...state,
      routineItems: [...state.routineItems, newItem]
    };
    await saveState(newState);
  };

  const deleteRoutineItem = async (id: string) => {
    const newState = {
      ...state,
      routineItems: state.routineItems.filter(i => i.id !== id)
    };
    await saveState(newState);
  };

  const toggleRoutineCompletion = async (itemId: string, date: string) => {
    const currentCompleted = state.routineCompletion[date] || [];
    const isCompleted = currentCompleted.includes(itemId);
    
    const newCompleted = isCompleted 
      ? currentCompleted.filter(id => id !== itemId)
      : [...currentCompleted, itemId];

    const newState = {
      ...state,
      routineCompletion: {
        ...state.routineCompletion,
        [date]: newCompleted
      }
    };
    await saveState(newState);
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      updateProfile,
      addTask, updateTask, 
      addHealthLog, 
      updateFinanceGoal,
      addNote, updateNote, deleteNote,
      addReport,
      addRoutineItem, deleteRoutineItem, toggleRoutineCompletion,
      refresh: fetchState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

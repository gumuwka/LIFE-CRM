export enum StreakStatus {
  NONE = 'NONE',
  PARTIAL = 'PARTIAL',
  FULL = 'FULL'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
  dueDate?: string;
  type: 'life' | 'health' | 'finance' | 'meeting';
}

export interface HealthLog {
  date: string;
  walks: number; // count
  dietDays: boolean;
  sleep8h: boolean;
}

export interface FinanceGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon?: string;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  maxXp: number;
  bio?: string;
}

export interface DailyReport {
  id: string;
  date: string;
  rating: number; // 1-10
  content: string;
  image?: string;
  createdAt: string;
}

export interface RoutineItem {
  id: string;
  label: string;
  iconName: string;
}

export interface AppState {
  profile: UserProfile;
  tasks: Task[];
  healthLogs: HealthLog[];
  financeGoals: FinanceGoal[];
  notes: Note[];
  reports: DailyReport[];
  routineItems: RoutineItem[];
  routineCompletion: { [date: string]: string[] }; // date -> list of routineItem IDs
  streak: {
    current: number;
    lastCheckIn: string | null;
    history: Record<string, StreakStatus>;
  };
}

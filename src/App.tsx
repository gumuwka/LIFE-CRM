/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppProvider } from './AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HealthSection } from './components/Health';
import { FinanceSection } from './components/Finance';
import { TasksSection } from './components/Tasks';
import { NotesSection } from './components/Notes';
import { CalendarSection } from './components/CalendarComponent';
import { ProfileSection } from './components/Profile';
import { ReportsSection } from './components/Reports';
import { RoutineSection } from './components/Routine';
import { AnalyticsSection } from './components/Analytics';
import { useAuth } from './AuthContext';
import { AuthForm } from './components/AuthForm';

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'health':
        return <HealthSection />;
      case 'finance':
        return <FinanceSection />;
      case 'reports':
        return <ReportsSection />;
      case 'routine':
        return <RoutineSection />;
      case 'tasks':
        return <TasksSection />;
      case 'notes':
        return <NotesSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </AppProvider>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <AuthenticatedApp />;
}


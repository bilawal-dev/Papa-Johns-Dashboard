'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import OverviewView from '@/components/views/overview-view';
import SoutheastView from '@/components/views/southeast-view';
import AIChatWidget from '@/components/dashboard/ai-chat-widget';
import { ViewType } from '@/types/dashboard';

export default function DashboardContainer() {
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'southeast':
        return <SoutheastView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-auto">
                <img
                  src="/franchise_logo.svg"
                  alt="Papa John's"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800">Project Dashboard</h1>
                <p className="text-sm text-slate-500">Colorado Store Renovation</p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data From Smartsheet</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
} 
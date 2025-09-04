'use client';

import { Calendar, CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
import { ViewType } from '@/types/dashboard';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const sidebarItems = [
    {
      id: 'overview' as ViewType,
      label: 'Overview',
      status: 'active',
      clickable: true
    },
    // {
    //   id: 'northeast' as ViewType,
    //   label: 'Northeast',
    //   status: 'upcoming',
    //   clickable: false
    // },
    // {
    //   id: 'southeast' as ViewType,
    //   label: 'Southeast',
    //   status: 'current',
    //   clickable: false
    // },
    // {
    //   id: 'midwest' as ViewType,
    //   label: 'Midwest',
    //   status: 'completed',
    //   clickable: false
    // },
    // {
    //   id: 'west' as ViewType,
    //   label: 'West',
    //   status: 'completed',
    //   clickable: false
    // }
  ];

  const getItemClasses = (item: any, isActive: boolean) => {
    const baseClasses = "flex items-center justify-between w-full px-6 py-5 text-left transition-all duration-200 border-r-4 mb-1 rounded-l-lg sidebar-item-hover hover:bg-red-50 border-transparent cursor-default";

    if (!item.clickable) {
      const statusClasses = {
        'completed': 'text-secondary bg-gray-50 opacity-60',
        'upcoming': 'text-muted opacity-60',
        'current': 'text-secondary opacity-60'
      };
      return `${baseClasses} ${statusClasses[item.status as keyof typeof statusClasses] || ''}`;
    }

    if (isActive) {
      return `${baseClasses} text-brand-primary font-semibold bg-red-50 border-r-2 border-r-red-400 shadow-lg`;
    }

    return `${baseClasses} text-muted border-transparent hover:text-secondary hover:bg-red-25`;
  };

  return (
    <nav className="w-60 bg-white border-r border-primary">
      <div className="p-6 border-b-2 border-red-300 mb-6">
        <div className="h-12 w-auto mx-auto">
          <img
            src="/franchise_logo.svg"
            alt="F45"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => item.clickable && onViewChange(item.id)}
              className={getItemClasses(item, isActive)}
              disabled={!item.clickable}
            >
              <span className="text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 
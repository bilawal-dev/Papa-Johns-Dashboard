'use client';

import { useSmartsheetData, useProjectSummary } from '@/hooks/useSmartsheetData';
import { getOverallProgress } from '@/utils/project-utils';
import { PROJECT_PHASES } from '@/constants/dashboard-data';
import ProgressTile from '@/components/dashboard/progress-tile';
import DataTable from '@/components/dashboard/data-table';
import MapComponent from '@/components/dashboard/map-component';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';

export default function PapaJohnsView() {
  const { data, loading, error } = useSmartsheetData();
  const projects = data?.rows || [];
  const summary = useProjectSummary(projects);
  const overallProgress = getOverallProgress(projects);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading data: {error}</div>
      </div>
    );
  }

  // Prepare table data
  const tableHeaders = ['Project Name', 'Status', 'City', 'State', 'Current Phase'];
  const tableRows = projects.map(project => [
    project.project_name,
    project.project_status,
    project.city,
    project.st,
    PROJECT_PHASES[getOverallProgress([project]).currentPhaseIndex] || 'Planning'
  ]);

  return (
    <div className="space-y-8">
      {/* Hero Section with Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Projects Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{summary.totalProjects}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Projects</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Projects Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">{summary.completedProjects}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Completed</div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-1">{summary.inProgressProjects}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">In Progress</div>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completion Percentage Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">{summary.completionPercentage}%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Complete</div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800">Project Locations</h2>
          <p className="text-sm text-slate-500 mt-1">Interactive map showing all project sites across Colorado</p>
        </div>
        <MapComponent />
      </div>

      {/* Charts Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <ProgressTile
          title="Project Phase Distribution"
          phases={PROJECT_PHASES}
          projects={projects}
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <DataTable
          title="Project Details"
          headers={tableHeaders}
          rows={tableRows}
          projects={projects}
          expandable={true}
        />
      </div>
    </div>
  );
}


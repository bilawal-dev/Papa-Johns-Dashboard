'use client';

import { useSmartsheetData, useProjectSummary } from '@/hooks/useSmartsheetData';
import { getOverallProgress } from '@/utils/project-utils';
import { PROJECT_PHASES } from '@/constants/dashboard-data';
import ProgressTile from '@/components/ui/progress-tile';
import DataTable from '@/components/ui/data-table';
import MapComponent from '@/components/dashboard/map-component';
import DashboardSkeleton from '@/components/ui/dashboard-skeleton';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Papa John's Project Dashboard
        </h1>
        <p className="text-secondary">
          Colorado Store Renovation Progress - {summary.totalProjects} Total Projects
        </p>
      </div>

      <MapComponent />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
          <div className="text-2xl font-bold text-brand-primary">{summary.totalProjects}</div>
          <div className="text-sm text-secondary">Total Projects</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
          <div className="text-2xl font-bold text-green-600">{summary.completedProjects}</div>
          <div className="text-sm text-secondary">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
          <div className="text-2xl font-bold text-blue-600">{summary.inProgressProjects}</div>
          <div className="text-sm text-secondary">In Progress</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
          <div className="text-2xl font-bold text-brand-primary">{summary.completionPercentage}%</div>
          <div className="text-sm text-secondary">Complete</div>
        </div>
      </div>

      {/* Progress Tile and Map */}
      <div className="gap-6 mb-8">
        <ProgressTile
          title="Project Phase Distribution"
          phases={PROJECT_PHASES}
          projects={projects}
        />
      </div>

      {/* Projects Table */}
      <DataTable
        title="Project Details"
        headers={tableHeaders}
        rows={tableRows}
        projects={projects}
        expandable={true}
      />
    </div>
  );
}

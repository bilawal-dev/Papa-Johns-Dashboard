import { SmartsheetRow } from '@/types/smartsheet';
import { PROJECT_PHASES } from '@/constants/dashboard-data';

export function getCurrentPhaseIndex(project: SmartsheetRow): number {
  // Determine current phase based on completed milestones
  if (project.install_complete) return 5; // Close-out
  if (project.install_start) return 4; // Installation
  if (project.ship_date_schedule) return 3; // Shipping
  if (project.production_released) return 2; // Production
  if (project.permit_approved) return 1; // Permitting
  return 0; // Planning
}

export function getProjectStatusFromPhase(phaseIndex: number): string {
  const statusMap = ['planning', 'permitting', 'production', 'shipping', 'installation', 'complete'];
  return statusMap[phaseIndex] || 'planning';
}

export function getPhaseProgress(projects: SmartsheetRow[]): { [phase: string]: number } {
  const phaseCount = PROJECT_PHASES.reduce((acc, phase) => {
    acc[phase] = 0;
    return acc;
  }, {} as { [phase: string]: number });

  projects.forEach(project => {
    const currentPhase = getCurrentPhaseIndex(project);
    const phaseName = PROJECT_PHASES[currentPhase];
    if (phaseName) {
      phaseCount[phaseName]++;
    }
  });

  return phaseCount;
}

export function getOverallProgress(projects: SmartsheetRow[]): {
  totalProjects: number;
  completedProjects: number;
  currentPhaseIndex: number;
  progressPercentage: number;
} {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.install_complete).length;
  
  // Calculate average phase progress
  const totalPhaseProgress = projects.reduce((sum, project) => {
    return sum + getCurrentPhaseIndex(project);
  }, 0);
  
  const averagePhaseIndex = totalProjects > 0 ? Math.floor(totalPhaseProgress / totalProjects) : 0;
  const progressPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return {
    totalProjects,
    completedProjects,
    currentPhaseIndex: averagePhaseIndex,
    progressPercentage
  };
}

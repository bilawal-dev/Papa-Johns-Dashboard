import { useState, useEffect } from 'react';
import { SmartsheetResponse, SmartsheetRow } from '@/types/smartsheet';

export function useSmartsheetData() {
  const [data, setData] = useState<SmartsheetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/smartsheet');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: SmartsheetResponse = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching Smartsheet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useProjectSummary(projects: SmartsheetRow[] = []) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.project_status.toLowerCase().includes('complete')).length;
  const inProgressProjects = totalProjects - completedProjects;
  const plannedProjects = projects.filter(p => !p.survey_requested).length;

  return {
    totalProjects,
    completedProjects,
    inProgressProjects,
    plannedProjects,
    completionPercentage: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
  };
}

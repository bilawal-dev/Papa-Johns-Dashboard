'use client';
import { SmartsheetRow } from '@/types/smartsheet';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell
} from 'recharts';

interface ProgressTileProps {
  title: string;
  phases: string[];
  projects: SmartsheetRow[];
}

const COLORS = [
  '#94A3B8', // Planning - slate-400
  '#F59E0B', // Permitting - amber-500
  '#8B5CF6', // Production - violet-500
  '#F97316', // Shipping - orange-500
  '#3B82F6', // Installation - blue-500
  '#10B981'  // Complete - emerald-500
];

export default function ProgressTile({ title, phases, projects }: ProgressTileProps) {
  // Count projects in each phase based on project_status
  const getPhaseCount = (phaseNumber: number) => {
    return projects.filter(project => {
      if (!project.project_status) return phaseNumber === 1; // Default to planning
      const status = project.project_status.toLowerCase();
      return status.includes(`${phaseNumber}.`);
    }).length;
  };

  const phaseCounts = phases.map((_, index) => getPhaseCount(index + 1));
  const totalProjects = projects.length;

  const chartData = phases.map((phase, index) => ({
    name: phase,
    value: phaseCounts[index]
  }));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">Distribution of projects across different phases</p>
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-slate-600">
          Total: <span className="font-bold text-slate-800">{totalProjects}</span> projects
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748B' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-xl">
            <div
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-4 h-4 rounded-full flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-700 truncate">{entry.name}</div>
              <div className="text-lg font-bold text-slate-900">{entry.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
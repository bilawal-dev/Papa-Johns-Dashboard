'use client';
import { SmartsheetRow } from '@/types/smartsheet';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface ProgressTileProps {
  title: string;
  phases: string[];
  projects: SmartsheetRow[];
}

const COLORS = [
  '#A0AEC0', // Planning - gray-400
  '#F56565', // Permitting - red-500
  '#9F7AEA', // Production - purple-500
  '#ED8936', // Shipping - orange-500
  '#4299E1', // Installation - blue-500
  '#48BB78'  // Complete - green-500
];

export default function ProgressTile({
  title,
  phases,
  projects
}: ProgressTileProps) {
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

  const renderLegend = (props: any) => {
    return (
      <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4">
        {chartData.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center space-x-2">
            <span
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-3 h-3 rounded-full"
            ></span>
            <span className="text-sm text-secondary">{entry.name}</span>
            <span className="text-sm font-bold text-brand-primary">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-brand-primary">{title}</h2>
        <div className="text-lg text-secondary">
          Total: <span className="font-bold text-brand-primary">{totalProjects}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-64">

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(4px)'
              }}
            />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[phases.indexOf(entry.name)]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(4px)'
              }}
            />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 
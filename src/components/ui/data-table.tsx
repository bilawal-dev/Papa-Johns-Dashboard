import { useState } from 'react';
import { SmartsheetRow } from '@/types/smartsheet';
import { getCurrentPhaseIndex } from '@/utils/project-utils';
import { PROJECT_PHASES } from '@/constants/dashboard-data';

interface DataTableProps {
  title: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  projects?: SmartsheetRow[];
  expandable?: boolean;
}

export default function DataTable({ title, headers, rows, projects, expandable = false }: DataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-primary">
        <h3 className="font-semibold text-brand-primary">
          {title}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-3 py-4 text-left font-semibold text-brand-primary border-b border-primary border-r border-primary text-xs leading-tight whitespace-normal max-w-24 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isExpanded = expandedRows.has(rowIndex);
              const project = projects?.[rowIndex];
              
              return (
                <>
                  <tr
                    key={rowIndex}
                    className={`hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150 ${
                      expandable ? 'cursor-pointer' : ''
                    }`}
                    style={rowIndex === 2 ? { backgroundColor: 'rgba(59, 130, 246, 0.05)' } : {}}
                    onClick={expandable ? () => toggleRow(rowIndex) : undefined}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 border-r border-gray-100 text-secondary last:border-r-0 text-sm"
                      >
                        {cellIndex === 0 && expandable && (
                          <span className="mr-2 text-gray-400">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        )}
                        {cell}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Expanded row content */}
                  {expandable && isExpanded && project && (
                    <tr key={`${rowIndex}-expanded`} className="bg-gray-50">
                      <td colSpan={headers.length} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-brand-primary mb-2">Project Details</h4>
                            <div className="space-y-1">
                              <div><strong>Address:</strong> {project.address}</div>
                              <div><strong>City:</strong> {project.city}, {project.st}</div>
                              <div><strong>Order:</strong> {project.order}</div>
                              <div><strong>Status:</strong> {project.project_status}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-brand-primary mb-2">Timeline</h4>
                            <div className="space-y-1">
                              {project.survey_requested && (
                                <div><strong>Survey Requested:</strong> {project.survey_requested}</div>
                              )}
                              {project.permit_submitted && (
                                <div><strong>Permit Submitted:</strong> {project.permit_submitted}</div>
                              )}
                              {project.production_released && (
                                <div><strong>Production Released:</strong> {project.production_released}</div>
                              )}
                              {project.install_start && (
                                <div><strong>Install Start:</strong> {project.install_start}</div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-brand-primary mb-2">Progress</h4>
                            <div className="space-y-2">
                              <div>
                                <strong>Current Phase:</strong> {PROJECT_PHASES[getCurrentPhaseIndex(project)]}
                              </div>
                              {project.status_comments && (
                                <div>
                                  <strong>Comments:</strong>
                                  <div className="text-xs text-gray-600 mt-1 p-2 bg-white rounded border">
                                    {project.status_comments}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
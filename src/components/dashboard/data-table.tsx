import { useState, useMemo, useCallback } from 'react';
import { SmartsheetRow } from '@/types/smartsheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique project statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    if (!projects) return [];
    const statuses = [...new Set(projects.map(project => project.project_status))];
    return statuses.filter(status => status && status.trim() !== '').sort();
  }, [projects]);

  // Filter rows based on search term and status filter
  const filteredData = useMemo(() => {
    if (!projects) return { rows, projects: [] };

    let filteredProjects = projects;

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredProjects = filteredProjects.filter(project =>
        project.project_status === statusFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.project_name.toLowerCase().includes(searchLower) ||
        project.city.toLowerCase().includes(searchLower) ||
        project.address.toLowerCase().includes(searchLower) ||
        project.st.toLowerCase().includes(searchLower) ||
        project.project_status.toLowerCase().includes(searchLower) ||
        (project.status_comments && project.status_comments.toLowerCase().includes(searchLower))
      );
    }

    // Filter corresponding rows
    const filteredRows = rows.filter((_, index) => {
      const originalProject = projects[index];
      return filteredProjects.includes(originalProject);
    });

    return { rows: filteredRows, projects: filteredProjects };
  }, [rows, projects, searchTerm, statusFilter]);

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setExpandedRows(new Set()); // Close all expanded rows when searching
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setExpandedRows(new Set()); // Close all expanded rows when filtering
  }, []);
  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">Comprehensive view of all project information</p>
          </div>

          {/* Search and Filter Controls */}
          {projects && projects.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-10 w-full sm:w-72 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-sm text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10 w-full sm:w-56 cursor-pointer bg-slate-50/50 border-slate-200 focus:ring-1 focus:ring-black transition-all duration-200 text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className='cursor-pointer'>All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status} className='cursor-pointer'>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Results Counter */}
              <div className="h-10 flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap bg-slate-100 px-4 rounded-sm">
                <span className="font-medium">{filteredData.projects.length}</span> of <span className="font-medium">{projects.length}</span> projects
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left font-semibold text-slate-700 text-sm tracking-wide whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-4 text-left font-semibold text-slate-700 text-sm tracking-wide whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {filteredData.rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                      <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.044-5.709-2.573M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="text-slate-600">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No projects match your search criteria'
                        : 'No projects available'
                      }
                    </div>
                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.rows.map((row, rowIndex) => {
                const isExpanded = expandedRows.has(rowIndex);
                const project = filteredData.projects[rowIndex];

                return (
                  <>
                    <tr
                      key={rowIndex}
                      className={`hover:bg-slate-50/50 whitespace-nowrap transition-all duration-200 ${expandable ? 'cursor-pointer' : ''
                        } ${isExpanded ? 'bg-blue-50/30' : ''}`}
                      onClick={expandable ? () => toggleRow(rowIndex) : undefined}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`${cellIndex === 0 ? 'flex items-center' : ''} px-6 py-4 text-slate-700 text-sm`}
                        >
                          {cellIndex === 0 && expandable && (
                            <span className="mr-3 text-slate-400 transition-transform duration-200">
                              {isExpanded ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </span>
                          )}
                          <span className="font-medium">{cell}</span>
                        </td>
                      ))}
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <Dialog>
                          <DialogTrigger asChild onClick={(e) => {e.stopPropagation()}}>
                            <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 cursor-pointer">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                          </DialogTrigger>
                          <DialogContent className="min-w-fit max-h-[90vh] overflow-y-auto py-10">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                                </svg>
                                {project?.project_name}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {project && (
                              <div className="mt-6 space-y-8">
                                {/* Project Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      Location Details
                                    </h3>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Address:</span>
                                        <span className="text-slate-800 font-semibold">{project.address}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">City:</span>
                                        <span className="text-slate-800 font-semibold">{project.city}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">State:</span>
                                        <span className="text-slate-800 font-semibold">{project.st}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Order #:</span>
                                        <span className="text-slate-800 font-semibold">{project.order}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200/50">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                      <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                      Current Status
                                    </h3>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Status:</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                          {project.project_status}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Current Phase:</span>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                                          {PROJECT_PHASES[getCurrentPhaseIndex(project)]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Timeline Section */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50">
                                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Project Timeline
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.survey_requested && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Survey Requested</div>
                                        <div className="text-lg font-bold text-slate-800">{project.survey_requested}</div>
                                      </div>
                                    )}
                                    {project.survey_received && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Survey Received</div>
                                        <div className="text-lg font-bold text-slate-800">{project.survey_received}</div>
                                      </div>
                                    )}
                                    {project.permit_submitted && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Permit Submitted</div>
                                        <div className="text-lg font-bold text-slate-800">{project.permit_submitted}</div>
                                      </div>
                                    )}
                                    {project.permit_approved && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Permit Approved</div>
                                        <div className="text-lg font-bold text-slate-800">{project.permit_approved}</div>
                                      </div>
                                    )}
                                    {project.production_released && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Production Released</div>
                                        <div className="text-lg font-bold text-slate-800">{project.production_released}</div>
                                      </div>
                                    )}
                                    {project.install_start && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Install Start</div>
                                        <div className="text-lg font-bold text-slate-800">{project.install_start}</div>
                                      </div>
                                    )}
                                    {project.install_complete && (
                                      <div className="bg-white/70 rounded-lg p-4 border border-amber-200/30">
                                        <div className="text-sm font-medium text-slate-600 mb-1">Install Complete</div>
                                        <div className="text-lg font-bold text-slate-800">{project.install_complete}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Comments Section */}
                                {project.status_comments && (
                                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200/50">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                      </svg>
                                      Status Comments
                                    </h3>
                                    <div className="bg-white/70 rounded-lg p-4 border border-purple-200/30">
                                      <p className="text-slate-700 leading-relaxed">{project.status_comments}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>

                    {/* Expanded row content */}
                    {expandable && isExpanded && project && (
                      <tr key={`${rowIndex}-expanded`} className="bg-white">
                        <td colSpan={headers.length + 1} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            <div className="bg-white rounded-xl p-4 border border-black/20">
                              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                                </svg>
                                Project Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Address:</span>
                                  <span className="font-medium text-slate-700">{project.address}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">City:</span>
                                  <span className="font-medium text-slate-700">{project.city}, {project.st}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Order:</span>
                                  <span className="font-medium text-slate-700">{project.order}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Status:</span>
                                  <span className="font-medium text-slate-700">{project.project_status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-black/20">
                              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Timeline
                              </h4>
                              <div className="space-y-2 text-sm">
                                {project.survey_requested && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Survey Requested:</span>
                                    <span className="font-medium text-slate-700">{project.survey_requested}</span>
                                  </div>
                                )}
                                {project.permit_submitted && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Permit Submitted:</span>
                                    <span className="font-medium text-slate-700">{project.permit_submitted}</span>
                                  </div>
                                )}
                                {project.production_released && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Production Released:</span>
                                    <span className="font-medium text-slate-700">{project.production_released}</span>
                                  </div>
                                )}
                                {project.install_start && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Install Start:</span>
                                    <span className="font-medium text-slate-700">{project.install_start}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-black/20">
                              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Progress
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Current Phase:</span>
                                  <span className="font-medium text-slate-700">{PROJECT_PHASES[getCurrentPhaseIndex(project)]}</span>
                                </div>
                                {project.status_comments && (
                                  <div>
                                    <span className="text-slate-500 block mb-2">Comments:</span>
                                    <div className="text-xs text-slate-600 p-3 bg-white/80 rounded-lg border border-slate-200/50">
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
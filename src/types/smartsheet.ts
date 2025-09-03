export interface SmartsheetColumn {
  id?: number;
  title: string;
  type: string;
}

export interface SmartsheetRow {
  id: number;
  project_name: string;
  project_status: string;
  status_comments: string;
  city: string;
  address: string;
  st: string;
  survey_requested: string;
  survey_received: string;
  brandbook_design_requested: string;
  brandbook_design_received: string;
  design_approval_requested: string;
  design_approval_received: string;
  landlord_approval_requested: string;
  landlord_approval_received: string;
  permit_submitted: string;
  permit_approved: string;
  production_released: string;
  ship_date_schedule: string;
  install_start: string;
  install_complete: string;
  order: string;
  lat?: number | null;
  lon?: number | null;
}

export interface SmartsheetResponse {
  name: string;
  totalRowCount: number;
  columns: SmartsheetColumn[];
  rows: SmartsheetRow[];
}

export interface ProjectPhase {
  name: string;
  completed: boolean;
  current: boolean;
}

export interface ProjectLocation {
  lat: number;
  lng: number;
  text: string;
  status: 'planning' | 'permitting' | 'production' | 'shipping' | 'installation' | 'complete';
}

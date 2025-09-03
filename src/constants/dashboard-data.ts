import { Region, POI, RegionStatus, StateProgress, ActivityItem, MetricCard, AIResponse } from '@/types/dashboard';
import { ProjectLocation } from '@/types/smartsheet';

// Colorado-specific project locations for Papa John's
export const COLORADO_LOCATIONS: ProjectLocation[] = [
  { lat: 39.8028, lng: -105.0878, text: "Arvada<br>8025 Sheridan Blvd", status: 'planning' },
  { lat: 39.8028, lng: -105.0878, text: "Arvada<br>12850 W 64th Ave", status: 'planning' },
  { lat: 39.7294, lng: -104.8319, text: "Aurora<br>15493-E E Hampden Ave", status: 'planning' },
  { lat: 39.7294, lng: -104.8319, text: "Aurora<br>580 S Chambers Rd", status: 'planning' },
  { lat: 39.7294, lng: -104.8319, text: "Aurora<br>20941 E Smoky Hill", status: 'planning' },
  { lat: 39.7392, lng: -104.9903, text: "Denver<br>Downtown", status: 'permitting' },
  { lat: 39.6403, lng: -106.3776, text: "Vail<br>Mountain Location", status: 'production' },
  { lat: 40.4150, lng: -105.0178, text: "Fort Collins<br>College Ave", status: 'shipping' },
  { lat: 38.8339, lng: -104.8214, text: "Colorado Springs<br>Academy Blvd", status: 'installation' },
  { lat: 39.5501, lng: -105.7821, text: "Littleton<br>Main Street", status: 'complete' }
];

// Project phases for Papa John's workflow
export const PROJECT_PHASES = [
  "Planning",
  "Permitting", 
  "Production",
  "Shipping",
  "Installation",
  "Complete"
];

// Legacy data for compatibility (can be removed later)
export const REGIONS: Record<string, Region> = {};
export const POIS: POI[] = [];

export const REGION_STATUS_DATA: RegionStatus[] = [
  {
    name: "Northeast",
    completedStores: 0,
    totalStores: 195,
    status: "planned"
  },
  {
    name: "Southeast", 
    completedStores: 102,
    totalStores: 210,
    status: "in-progress"
  },
  {
    name: "Midwest",
    completedStores: 185,
    totalStores: 185,
    status: "completed"
  },
  {
    name: "West",
    completedStores: 210,
    totalStores: 210,
    status: "completed"
  }
];

export const SOUTHEAST_STATES: StateProgress[] = [
  {
    name: "Texas",
    completed: "28/52",
    currentPhase: "Installation",
    status: "ahead",
    issues: 1,
    lastUpdated: "2 hours ago"
  },
  {
    name: "Florida",
    completed: "18/31", 
    currentPhase: "Installation",
    status: "on-track",
    issues: 0,
    lastUpdated: "4 hours ago"
  },
  {
    name: "Georgia",
    completed: "15/24",
    currentPhase: "Installation", 
    status: "on-track",
    issues: 0,
    lastUpdated: "1 day ago"
  },
  {
    name: "North Carolina",
    completed: "12/22",
    currentPhase: "Shipping",
    status: "behind",
    issues: 1,
    hasAISummary: true,
    aiSummaryData: "north-carolina",
    lastUpdated: "6 hours ago"
  },
  {
    name: "Virginia",
    completed: "11/19",
    currentPhase: "Installation",
    status: "on-track", 
    issues: 0,
    lastUpdated: "3 hours ago"
  },
  {
    name: "South Carolina",
    completed: "9/15",
    currentPhase: "Installation",
    status: "on-track",
    issues: 0,
    lastUpdated: "1 day ago"
  },
  {
    name: "Tennessee",
    completed: "6/13",
    currentPhase: "Shipping",
    status: "on-track",
    issues: 0,
    lastUpdated: "8 hours ago"
  },
  {
    name: "Maryland",
    completed: "3/11", 
    currentPhase: "Production",
    status: "on-track",
    issues: 0,
    lastUpdated: "5 hours ago"
  },
  {
    name: "Alabama",
    completed: "0/8",
    currentPhase: "Permitting",
    status: "on-track",
    issues: 0,
    lastUpdated: "2 days ago"
  },
  {
    name: "Other States",
    completed: "0/15",
    currentPhase: "Planning",
    status: "scheduled",
    issues: 0,
    lastUpdated: "1 week ago"
  }
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "1",
    type: "success",
    text: "3 locations completed in Houston, TX",
    time: "2 hours ago"
  },
  {
    id: "2", 
    type: "info",
    text: "Permit approved for Charlotte, NC batch",
    time: "6 hours ago"
  },
  {
    id: "3",
    type: "warning",
    text: "Weather delay resolved in Raleigh, NC", 
    time: "1 day ago"
  },
  {
    id: "4",
    type: "success",
    text: "Production shipment arrived in Atlanta",
    time: "2 days ago"
  },
  {
    id: "5",
    type: "info",
    text: "Virginia batch entered installation phase",
    time: "3 days ago"
  }
];

export const OVERVIEW_METRICS: MetricCard[] = [
  {
    number: "87%",
    label: "Project Health Score",
    status: { type: "good", text: "Good" }
  },
  {
    number: "7 days", 
    label: "Ahead of Schedule",
    status: { type: "ahead", text: "Ahead" }
  }
];

export const SOUTHEAST_METRICS: MetricCard[] = [
  {
    number: "102/210",
    label: "Locations Completed",
    status: { type: "ahead", text: "49% Complete" }
  },
  {
    number: "7 days",
    label: "Ahead of Schedule", 
    status: { type: "ahead", text: "On Track" }
  },
  {
    number: "Installation",
    label: "Current Phase",
    status: { type: "on-track", text: "Active" }
  },
  {
    number: "2",
    label: "Locations Need Attention",
    status: { type: "behind", text: "Action Required" }
  }
];

export const AI_RESPONSES: Record<string, AIResponse> = {
  'project-status': {
    user: "Get project status summary",
    ai: "📊 **Project Status Summary**\n\n✅ **Overall Health:** 87% - Good\n⏰ **Timeline:** 7 days ahead of schedule\n📍 **Current Focus:** Southeast region (49% complete)\n\n**Key Metrics:**\n• 497/800 locations completed (62%)\n• 2 regions fully completed (West, Midwest)\n• 1 active region with strong progress\n• 0 critical blockers\n\n**Next 30 Days:** Complete Southeast region, begin Northeast planning phase."
  },
  'southeast-update': {
    user: "Southeast region update", 
    ai: "🎯 **Southeast Region Update**\n\n**Progress:** 102/210 locations (49%)\n**Status:** 7 days ahead of schedule ✨\n**Current Phase:** Installation\n\n**State Breakdown:**\n• Texas: 28/52 (Leading, 1 minor issue)\n• Florida: 18/31 (On track)\n• Georgia: 15/24 (On track)\n• N. Carolina: 12/22 (Behind due to permits)\n\n**Immediate Actions Needed:**\n🚨 Dallas Downtown, TX - Permit amendment\n⚠️ Charlotte Metro, NC - Material delivery\n\n**Forecast:** Region completion by Dec 28 (original target: Jan 4)"
  },
  'upcoming-deadlines': {
    user: "Show upcoming deadlines",
    ai: "⏰ **Upcoming Deadlines & Milestones**\n\n**This Week:**\n• Dec 12: Dallas permit amendment resolution\n• Dec 13: 4 permit applications due (Alabama)\n• Dec 15: Alabama → Production phase transition\n\n**Next Week:**\n• Dec 18-22: 18 installations scheduled\n• Dec 20: Crew rotation in Southeast\n• Dec 22: 6 production shipments arriving\n\n**Month End:**\n• Dec 28: Southeast region target completion\n• Dec 31: Q4 milestone review\n\n**Critical Path:** Maintain Alabama timeline to avoid Northeast delays."
  },
  'resource-allocation': {
    user: "Resource allocation analysis",
    ai: "👥 **Resource Allocation Analysis**\n\n**Current Capacity:**\n• 6 active installation crews\n• 2 standby crews available\n• 22-25 locations/week throughput\n\n**Utilization:**\n• Southeast: 85% capacity (optimal)\n• Support teams: 78% utilization\n• Equipment: 92% availability\n\n**Recommendations:**\n🔄 **Crew Rotation:** Dec 20th as planned\n📈 **Capacity Boost:** Add 1 crew for Northeast launch\n⚡ **Bottleneck:** Urban permit processing (not crew-related)\n\n**Cost Efficiency:** 3% under budget due to early completions"
  },
  'issue-resolution': {
    user: "Help resolve current issues",
    ai: "🚨 **Current Issues & Resolutions**\n\n**Issue #1: Dallas Downtown, TX**\n• Problem: Permit amendment required\n• Impact: 2 days behind schedule\n• Resolution: Amendment submitted Dec 10\n• Expected Clear: Dec 12\n• Action: Monitor city review process\n\n**Issue #2: Charlotte Metro, NC**\n• Problem: Material delivery delay\n• Impact: 1 day behind schedule\n• Resolution: Expedited shipping arranged\n• Expected Delivery: Tomorrow AM\n• Action: Crew standing by for install\n\n**Preventive Measures:**\n✅ Buffer inventory increased by 15%\n✅ Backup permit applications filed earlier\n\n**Risk Level:** Low - both issues have clear resolution paths"
  },
  'leave-message': {
    user: "Leave message with team",
    ai: "💬 **Message Center**\n\nI can help you send a message to:\n\n🏗️ **Field Operations Team**\n📋 **Project Managers**\n🎯 **Regional Coordinators**\n📊 **Executive Dashboard**\n\n**Quick Messages:**\n• Request status update\n• Report field observations\n• Escalate urgent issue\n• Schedule coordination call\n• Resource request\n\n*Note: All messages are logged and routed to appropriate team members based on urgency and content.*\n\nWhat would you like to communicate?"
  }
}; 
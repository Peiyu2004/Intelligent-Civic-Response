export interface Report {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  issueType: string;
  severity: number; // 1-10
  date: string;
  clusterId: string;
  status: "in progress" | "completed";
}

export interface Cluster {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  totalReports: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  averageSeverity: number;
}

export interface WorkOrder {
  id: string;
  cluster_id?: string;
  priorityLevel: number;
  assignedTeam: string;
  totalReports: number;
  status: "in progress" | "completed";
}

export interface IssueTypeData {
  name: string;
  count: number;
}

export type SeverityFilter = "all" | "high" | "medium" | "low";
export type StatusFilter = "all" | "in progress" | "completed";

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
<<<<<<< HEAD
=======
  cluster_id?: string;
>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7
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

import { Report, Cluster, WorkOrder, IssueTypeData } from "../types";
import apiConfig from "../config/api.ts";

class ApiService {
  private baseURL = apiConfig.baseURL;
  private headers = apiConfig.headers;

  /**
   * Generic fetch method with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...(options.headers as Record<string, string>),
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Reports API
  async getReports(): Promise<Report[]> {
    return this.fetch<Report[]>("/reports");
  }

  async getReportsByCluster(clusterId: string): Promise<Report[]> {
    return this.fetch<Report[]>(`/reports?clusterId=${clusterId}`);
  }

  async getReportById(reportId: string): Promise<Report> {
    return this.fetch<Report>(`/reports/${reportId}`);
  }

  async updateReportStatus(
    reportId: string,
    status: "in progress" | "completed",
  ): Promise<Report> {
    return this.fetch<Report>(`/reports/${reportId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Clusters API
  async getClusters(): Promise<Cluster[]> {
    return this.fetch<Cluster[]>("/clusters");
  }

  async getClusterById(clusterId: string): Promise<Cluster> {
    return this.fetch<Cluster>(`/clusters/${clusterId}`);
  }

  // Work Orders API
  async getWorkOrders(): Promise<WorkOrder[]> {
    return this.fetch<WorkOrder[]>("/work-orders");
  }

  // Issue Type Chart API
  async getIssueTypeData(): Promise<IssueTypeData[]> {
    return this.fetch<IssueTypeData[]>("/issue-types");
  }

  // Dashboard Stats API
  async getDashboardStats(): Promise<{
    totalReports: number;
    highSeverityReports: number;
    workOrdersCount: number;
    clusterCount: number;
  }> {
    return this.fetch("/dashboard/stats");
  }

  // Filter Reports API
  async filterReports(filters: {
    status?: string;
    severity?: string;
    location?: string;
    clusterId?: string;
  }): Promise<Report[]> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.location) params.append("location", filters.location);
    if (filters.clusterId) params.append("clusterId", filters.clusterId);

    return this.fetch<Report[]>(`/reports?${params.toString()}`);
  }
}

export default new ApiService();

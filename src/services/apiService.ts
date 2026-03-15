import { Report, Cluster, WorkOrder, IssueTypeData } from "../types";
import apiConfig from "../config/api.ts";

class ApiService {
  private baseURL = apiConfig.baseURL;
  private headers = apiConfig.headers;
<<<<<<< HEAD
=======
  private isServerAvailable = true; // Track if server is responding
>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7

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
<<<<<<< HEAD
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
=======
        console.error(
          `API Response not OK: ${response.status} ${response.statusText}`,
        );
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Invalid content type: ${contentType}`);
        console.error(`Endpoint: ${this.baseURL}${endpoint}`);
        this.isServerAvailable = false;
        throw new Error(
          `Invalid response type. Expected JSON, got ${contentType}`,
        );
      }

      this.isServerAvailable = true;
      const data = await response.json();
      return data;
    } catch (error) {
      this.isServerAvailable = false;
>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7
      console.error("API Error:", error);
      throw error;
    }
  }

<<<<<<< HEAD
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
=======
  /**
   * Check if server is available
   */
  async isApiAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/reports`);
      return (
        (response.ok &&
          response.headers.get("content-type")?.includes("application/json")) ||
        false
      );
    } catch {
      return false;
    }
  }

  // ==========================================
  // REPORTS API
  // ==========================================

  /**
   * Get all reports from database
   */
  async getReports(): Promise<Report[]> {
    try {
      console.log("Fetching reports from:", `${this.baseURL}/api/reports`);
      const data = await this.fetch<any[]>("/api/reports");
      console.log("Reports received:", data);
      return data.map((r) => this.transformReport(r));
    } catch (error) {
      console.error("Error fetching reports from API:", error);
      console.log("Falling back to mock data");
      throw error;
    }
  }

  /**
   * Get single report by ID
   */
  async getReportById(reportId: number): Promise<Report> {
    try {
      const data = await this.fetch<any>(`/api/report/${reportId}`);
      return this.transformReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  }

  // /**
  //  * Get reports by cluster ID
  //  */
  // async getReportsByCluster(clusterId: number): Promise<Report[]> {
  //   try {
  //     const allReports = await this.getReports();
  //     return allReports.filter((r) => r.clusterId === clusterId);
  //   } catch (error) {
  //     console.error("Error fetching reports by cluster:", error);
  //     throw error;
  //   }
  // }

  /**
   * Get reports by cluster ID
   */
  async getReportsByCluster(clusterId: string | number): Promise<Report[]> {
    try {
      const clusterIdStr = clusterId.toString(); // ✅ Convert to string for comparison
      const allReports = await this.getReports();
      return allReports.filter((r) => r.clusterId === clusterIdStr);
    } catch (error) {
      console.error("Error fetching reports by cluster:", error);
      throw error;
    }
  }

  /**
   * Update report status
   */
  // async updateReportStatus(
  //   reportId: number,
  //   status: "in progress" | "completed",
  // ): Promise<Report> {
  //   try {
  //     const reportStatus = status === "in progress" ? "Pending" : "Fixed";
  //     const data = await this.fetch<any>(`/api/report/${reportId}`, {
  //       method: "PUT",
  //       body: JSON.stringify({ report_status: reportStatus }),
  //     });
  //     return this.transformReport(data);
  //   } catch (error) {
  //     console.error("Error updating report status:", error);
  //     throw error;
  //   }
  // }

  async updateReportStatus(
    reportId: number,
    status: "in progress" | "completed",
  ): Promise<Report> {
    try {
      const reportStatus = status === "in progress" ? "Pending" : "Fixed";
      console.log(`🔄 Updating report ${reportId} to ${reportStatus}`);

      const data = await this.fetch<any>(`/api/report/${reportId}`, {
        method: "PUT",
        body: JSON.stringify({ report_status: reportStatus }),
      });

      console.log("✅ Report updated:", data);
      return this.transformReport(data);
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  }
  /**
   * Create new report
   */
  async createReport(reportData: {
    user_id: number;
    description: string;
    location: string;
    image_path?: string;
    damage_type?: string;
    severity_score?: number;
  }): Promise<any> {
    try {
      const response = await this.fetch<any>("/api/report", {
        method: "POST",
        body: JSON.stringify(reportData),
      });
      return response;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId: number): Promise<any> {
    try {
      const response = await this.fetch<any>(`/api/report/${reportId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  }

  // ==========================================
  // CLUSTERS API
  // ==========================================

  /**
   * Get all damage clusters
   */
  async getClusters(): Promise<Cluster[]> {
    try {
      console.log("Fetching clusters from:", `${this.baseURL}/api/clusters`);
      const data = await this.fetch<any[]>("/api/clusters");
      console.log("Clusters received:", data);
      return data.map((c) => this.transformCluster(c));
    } catch (error) {
      console.error("Error fetching clusters from API:", error);
      throw error;
    }
  }

  // /**
  //  * Get single cluster by ID
  //  */
  // async getClusterById(clusterId: number): Promise<Cluster> {
  //   try {
  //     const clusters = await this.getClusters();
  //     const cluster = clusters.find((c) => c.id === clusterId);
  //     if (!cluster) {
  //       throw new Error(`Cluster ${clusterId} not found`);
  //     }
  //     return cluster;
  //   } catch (error) {
  //     console.error("Error fetching cluster:", error);
  //     throw error;
  //   }
  // }

  /**
   * Get single cluster by ID
   */
  async getClusterById(clusterId: string | number): Promise<Cluster> {
    try {
      const clusters = await this.getClusters();
      const clusterIdStr = clusterId.toString(); // ✅ Convert to string
      const cluster = clusters.find((c) => c.id === clusterIdStr); // ✅ Now both are strings
      if (!cluster) {
        throw new Error(`Cluster ${clusterId} not found`);
      }
      return cluster;
    } catch (error) {
      console.error("Error fetching cluster:", error);
      throw error;
    }
  }

  /**
   * Get clustered reports (automatic clustering)
   */
  async getClusteredReports(): Promise<any[]> {
    try {
      const data = await this.fetch<any[]>("/api/clustered-reports");
      return data;
    } catch (error) {
      console.error("Error fetching clustered reports:", error);
      throw error;
    }
  }

  // ==========================================
  // WORK ORDERS API
  // ==========================================

  /**
   * Get all work orders
   */
  async getWorkOrders(): Promise<WorkOrder[]> {
    try {
      console.log(
        "Fetching work orders from:",
        `${this.baseURL}/api/workorders`,
      );
      const data = await this.fetch<any[]>("/api/workorders");
      console.log("Work orders received:", data);
      return data.map((w) => this.transformWorkOrder(w));
    } catch (error) {
      console.error("Error fetching work orders from API:", error);
      throw error;
    }
  }

  /**
   * Create new work order
   */
  async createWorkOrder(workOrderData: {
    cluster_id: number;
    team: string;
  }): Promise<any> {
    try {
      const response = await this.fetch<any>("/api/work-orders", {
        method: "POST",
        body: JSON.stringify(workOrderData),
      });
      return response;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw error;
    }
  }

  /**
   * Update work order status
   */
  async updateWorkOrderStatus(
    workorderId: number,
    repairStatus: string,
  ): Promise<any> {
    try {
      const response = await this.fetch<any>("/api/work-orders/update-status", {
        method: "PUT",
        body: JSON.stringify({
          workorder_id: workorderId,
          repair_status: repairStatus,
        }),
      });
      return response;
    } catch (error) {
      console.error("Error updating work order status:", error);
      throw error;
    }
  }

  /**
   * Complete work order (marks as completed)
   */
  async completeWorkOrder(workorderId: number): Promise<any> {
    try {
      const response = await this.fetch<any>(
        `/api/work-orders/complete/${workorderId}`,
        {
          method: "POST",
        },
      );
      return response;
    } catch (error) {
      console.error("Error completing work order:", error);
      throw error;
    }
  }

  // ==========================================
  // UPLOAD API
  // ==========================================

  /**
   * Upload image file
   */
  async uploadImage(file: File): Promise<{ image_path: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload Error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  /**
   * Get dashboard statistics
   */
>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7
  async getDashboardStats(): Promise<{
    totalReports: number;
    highSeverityReports: number;
    workOrdersCount: number;
    clusterCount: number;
  }> {
<<<<<<< HEAD
    return this.fetch("/dashboard/stats");
  }

  // Filter Reports API
=======
    try {
      const reports = await this.getReports();
      const clusters = await this.getClusters();
      const workOrders = await this.getWorkOrders();

      const highSeverityReports = reports.filter((r) => r.severity >= 7).length;

      return {
        totalReports: reports.length,
        highSeverityReports,
        workOrdersCount: workOrders.length,
        clusterCount: clusters.length,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // ==========================================
  // ISSUE TYPE DATA (for charts)
  // ==========================================

  /**
   * Get issue type distribution
   */
  async getIssueTypeData(): Promise<IssueTypeData[]> {
    try {
      const reports = await this.getReports();

      // Group reports by damage_type
      const issueTypeMap = new Map<string, number>();

      reports.forEach((report) => {
        const type = report.issueType || "Unknown";
        issueTypeMap.set(type, (issueTypeMap.get(type) || 0) + 1);
      });

      // Convert to array format
      const result = Array.from(issueTypeMap, ([name, count]) => ({
        name,
        count,
      }));

      console.log("Issue type data:", result);
      return result;
    } catch (error) {
      console.error("Error fetching issue type data:", error);
      throw error;
    }
  }

  // ==========================================
  // FILTERING API
  // ==========================================

  // /**
  //  * Filter reports with multiple criteria
  //  */
  // async filterReports(filters: {
  //   status?: string;
  //   severity?: string;
  //   location?: string;
  //   clusterId?: number;
  // }): Promise<Report[]> {
  //   try {
  //     let reports = await this.getReports();

  //     // Filter by status
  //     if (filters.status && filters.status !== "all") {
  //       const statusMap: Record<string, string> = {
  //         "in progress": "Pending",
  //         completed: "Fixed",
  //       };
  //       const dbStatus = statusMap[filters.status] || filters.status;
  //       reports = reports.filter((r) => r.status === dbStatus);
  //     }

  //     // Filter by severity
  //     if (filters.severity && filters.severity !== "all") {
  //       if (filters.severity === "high") {
  //         reports = reports.filter((r) => r.severity >= 7);
  //       } else if (filters.severity === "medium") {
  //         reports = reports.filter((r) => r.severity >= 4 && r.severity < 7);
  //       } else if (filters.severity === "low") {
  //         reports = reports.filter((r) => r.severity < 4);
  //       }
  //     }

  //     // Filter by location
  //     if (filters.location) {
  //       reports = reports.filter((r) =>
  //         r.location.toLowerCase().includes(filters.location!.toLowerCase()),
  //       );
  //     }

  //     // Filter by cluster
  //     if (filters.clusterId) {
  //       reports = reports.filter((r) => r.clusterId === filters.clusterId);
  //     }

  //     return reports;
  //   } catch (error) {
  //     console.error("Error filtering reports:", error);
  //     throw error;
  //   }
  // }

>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7
  async filterReports(filters: {
    status?: string;
    severity?: string;
    location?: string;
<<<<<<< HEAD
    clusterId?: string;
  }): Promise<Report[]> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.location) params.append("location", filters.location);
    if (filters.clusterId) params.append("clusterId", filters.clusterId);

    return this.fetch<Report[]>(`/reports?${params.toString()}`);
=======
    clusterId?: string; // ✅ CHANGED from number to string
  }): Promise<Report[]> {
    try {
      let reports = await this.getReports();

      // Filter by status
      if (filters.status && filters.status !== "all") {
        const statusMap: Record<string, string> = {
          "in progress": "Pending",
          completed: "Fixed",
        };
        const dbStatus = statusMap[filters.status] || filters.status;
        reports = reports.filter((r) => r.status === dbStatus);
      }

      // Filter by severity
      if (filters.severity && filters.severity !== "all") {
        if (filters.severity === "high") {
          reports = reports.filter((r) => r.severity >= 7);
        } else if (filters.severity === "medium") {
          reports = reports.filter((r) => r.severity >= 4 && r.severity < 7);
        } else if (filters.severity === "low") {
          reports = reports.filter((r) => r.severity < 4);
        }
      }

      // Filter by location
      if (filters.location) {
        reports = reports.filter((r) =>
          r.location.toLowerCase().includes(filters.location!.toLowerCase()),
        );
      }

      // Filter by cluster
      if (filters.clusterId) {
        reports = reports.filter((r) => r.clusterId === filters.clusterId); // ✅ NOW BOTH ARE STRINGS
      }

      return reports;
    } catch (error) {
      console.error("Error filtering reports:", error);
      throw error;
    }
  }

  // ==========================================
  // TRANSFORMATION HELPERS
  // ==========================================

  /**
   * Transform database report to frontend format
   */
  private transformReport(dbReport: any): Report {
    return {
      id: dbReport.report_id?.toString() || dbReport.id || "",
      location: dbReport.location || "",
      latitude: parseFloat(dbReport.location_lat) || 0,
      longitude: parseFloat(dbReport.location_lon) || 0,
      issueType: dbReport.damage_type || "Unknown",
      severity: parseFloat(dbReport.severity_score) || 0,
      date:
        dbReport.created_at?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      clusterId: dbReport.cluster_id?.toString() || "", // ✅ Make sure this is set
      status:
        dbReport.report_status === "Pending"
          ? "in progress"
          : dbReport.report_status === "Fixed"
            ? "completed"
            : "in progress",
    };
  }

  /**
   * Transform database cluster to frontend format
   */
  private transformCluster(dbCluster: any): Cluster {
    const reports = dbCluster.reports || [];
    const highSeverity = reports.filter(
      (r: any) => parseFloat(r.severity_score) >= 7,
    ).length;
    const mediumSeverity = reports.filter(
      (r: any) =>
        parseFloat(r.severity_score) >= 4 && parseFloat(r.severity_score) < 7,
    ).length;
    const lowSeverity = reports.filter(
      (r: any) => parseFloat(r.severity_score) < 4,
    ).length;

    return {
      id: dbCluster.cluster_id?.toString() || dbCluster.id || "",
      location: dbCluster.cluster_area || "Unknown Area",
      latitude: parseFloat(dbCluster.center_lat) || 0,
      longitude: parseFloat(dbCluster.center_lon) || 0,
      totalReports: dbCluster.total_report || reports.length || 0,
      highSeverity,
      mediumSeverity,
      lowSeverity,
      averageSeverity: parseFloat(dbCluster.avg_severity) || 0,
    };
  }

  /**
   * Transform database work order to frontend format
   */
  private transformWorkOrder(dbOrder: any): WorkOrder {
    return {
      id: dbOrder.workorder_id?.toString() || dbOrder.id || "",
      cluster_id: dbOrder.cluster_id?.toString() || "", // ✅ MAKE SURE THIS IS SET
      priorityLevel: dbOrder.priority_level || 0,
      assignedTeam: dbOrder.assigned_team || "",
      totalReports: dbOrder.total_report || 0,
      status:
        dbOrder.repair_status === "In Progress"
          ? "in progress"
          : dbOrder.repair_status === "Completed"
            ? "completed"
            : "in progress",
    };
>>>>>>> 14eae9dff0458dda7f7c2f8e06f74f050d41c7a7
  }
}

export default new ApiService();

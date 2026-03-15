import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header.tsx";
import { Sidebar } from "../components/Layout/Sidebar.tsx";
import { StatCard } from "../components/Dashboard/StatCard.tsx";
import { MapView } from "../components/Dashboard/MapView.tsx";
import { ReportDetailCard } from "../components/Dashboard/ReportDetailCard.tsx";
import { PriorityWorkOrder } from "../components/Dashboard/PriorityWorkOrder.tsx";
import { IssueTypeChart } from "../components/Dashboard/IssueTypeChart.tsx";
import { ClusterReportModal } from "../components/Dashboard/ClusterReportModal.tsx";
import {
  mockReports,
  mockClusters,
  mockWorkOrders,
  mockIssueTypeData,
} from "../data/mockData.ts";
import apiService from "../services/apiService.ts";
import { Report, Cluster, WorkOrder, IssueTypeData } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );

  // API Data States
  const [reports, setReports] = useState<Report[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [issueTypeData, setIssueTypeData] = useState<IssueTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to fetch all data
  const fetchData = async () => {
    <PriorityWorkOrder
      workOrders={workOrders}
      reports={reports} // ✅ ADD THIS
      clusters={clusters} // ✅ ADD THIS
      onViewAllReports={handleViewAllReports}
      onClusterClick={handleClusterClick}
    />;

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Starting dashboard data fetch...");

      let reportsData: Report[] = [];
      let clustersData: Cluster[] = [];
      let workOrdersData: WorkOrder[] = [];
      let issueData: IssueTypeData[] = [];
      let usingMock = false;

      // Fetch Reports
      try {
        console.log("📥 Fetching reports...");
        reportsData = await apiService.getReports();
        console.log("✅ Reports fetched:", reportsData.length);
      } catch (err) {
        console.warn("⚠️ Failed to fetch reports, using mock data:", err);
        reportsData = mockReports;
        usingMock = true;
      }

      // Fetch Clusters
      try {
        console.log("📥 Fetching clusters...");
        clustersData = await apiService.getClusters();
        console.log("✅ Clusters fetched:", clustersData.length);
      } catch (err) {
        console.warn("⚠️ Failed to fetch clusters, using mock data:", err);
        clustersData = mockClusters;
        usingMock = true;
      }

      // Fetch Work Orders
      try {
        console.log("📥 Fetching work orders...");
        workOrdersData = await apiService.getWorkOrders();
        console.log("✅ Work orders fetched:", workOrdersData.length);
      } catch (err) {
        console.warn("⚠️ Failed to fetch work orders, using mock data:", err);
        workOrdersData = mockWorkOrders;
        usingMock = true;
      }

      // Fetch Issue Type Data
      try {
        console.log("📥 Fetching issue type data...");
        issueData = await apiService.getIssueTypeData();
        console.log("✅ Issue type data fetched:", issueData.length);
      } catch (err) {
        console.warn(
          "⚠️ Failed to fetch issue type data, using mock data:",
          err,
        );
        issueData = mockIssueTypeData;
        usingMock = true;
      }

      setReports(reportsData);
      setClusters(clustersData);
      setWorkOrders(workOrdersData);
      setIssueTypeData(issueData);
      setUsesMockData(usingMock);

      if (usingMock) {
        setError(
          "⚠️ Backend server not available. Using demo data. Make sure your Python backend is running at http://localhost:5000",
        );
      }

      console.log("✅ Dashboard data loaded successfully");
    } catch (err) {
      console.error("❌ Fatal error fetching data:", err);
      setError("Failed to load dashboard data. Using demo data.");
      setReports(mockReports);
      setClusters(mockClusters);
      setWorkOrders(mockWorkOrders);
      setIssueTypeData(mockIssueTypeData);
      setUsesMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ REFETCH DATA WHEN USER RETURNS TO THIS PAGE
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Dashboard page became visible, refetching data...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleStatusChange = async (
    reportId: string,
    status: "in progress" | "completed",
  ) => {
    try {
      const reportIdNum = parseInt(reportId);
      const updatedReport = await apiService.updateReportStatus(
        reportIdNum,
        status,
      );
      setReports(reports.map((r) => (r.id === reportId ? updatedReport : r)));
    } catch (err) {
      console.error("Error updating report status:", err);
      setReports(
        reports.map((r) => (r.id === reportId ? { ...r, status } : r)),
      );
    }
  };
  const handleViewAllReports = () => {
    navigate("/report-list");
  };

  const handleClusterClick = (clusterId: string) => {
    setSelectedClusterId(clusterId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectedCluster = selectedClusterId
    ? clusters.find((c) => c.id === selectedClusterId)
    : null;

  const highSeverityReports = reports.filter((r) => r.severity >= 7).length;
  const workOrdersCount = workOrders.reduce(
    (sum, wo) => sum + wo.totalReports,
    0,
  );
  const clusterCount = clusters.length;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 pt-20">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6">
          <div className="w-full mx-auto space-y-6">
            {/* Warning Banner - Mock Data */}
            {usesMockData && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800 text-sm font-medium">
                  ℹ️ <strong>Demo Mode:</strong> Using sample data. Backend
                  server not available.
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  To use real data, start Python backend:{" "}
                  <code className="bg-yellow-100 px-2 py-1 rounded">
                    python app.py
                  </code>{" "}
                  at{" "}
                  <code className="bg-yellow-100 px-2 py-1 rounded">
                    http://localhost:5000
                  </code>
                </p>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-800 text-sm">
                  <strong>⚠️ Error:</strong> {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Reports"
                value={reports.length}
                subtitle="Case"
              />
              <StatCard
                title="High Severity Reports"
                value={highSeverityReports}
                subtitle="Requires urgent repair"
              />
              <StatCard
                title="Work Orders"
                value={workOrdersCount}
                subtitle="Have Assigned"
              />
              <StatCard
                title="Hotspot Areas"
                value={clusterCount}
                subtitle="Cases Grouped in a Cluster"
              />
            </div>

            {/* Map and Report Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapView
                  clusters={clusters}
                  reports={reports}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                />
              </div>

              {selectedReport && (
                <div className="lg:col-span-1">
                  <ReportDetailCard
                    report={selectedReport}
                    onViewDetail={() =>
                      handleClusterClick(selectedReport.clusterId)
                    }
                  />
                </div>
              )}
            </div>

            {/* Work Order and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Priority Work Orders take 4/7 width */}
              <div className="lg:col-span-4">
                <PriorityWorkOrder
                  workOrders={workOrders}
                  onViewAllReports={handleViewAllReports}
                  onClusterClick={handleClusterClick}
                />
              </div>

              {/* Issue Type Chart takes 3/7 width */}
              <div className="lg:col-span-3">
                <IssueTypeChart data={issueTypeData} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Cluster Report Modal */}
      {selectedCluster && (
        <ClusterReportModal
          cluster={selectedCluster}
          reports={reports}
          onClose={() => setSelectedClusterId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

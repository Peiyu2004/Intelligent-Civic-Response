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
// import {
//   mockReports,
//   mockClusters,
//   mockWorkOrders,
//   mockIssueTypeData,
// } from "../data/mockData.ts";
// import { Report } from "../types";
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [reportsData, clustersData, workOrdersData, issueData] =
          await Promise.all([
            apiService.getReports(),
            apiService.getClusters(),
            apiService.getWorkOrders(),
            apiService.getIssueTypeData(),
          ]);

        setReports(reportsData);
        setClusters(clustersData);
        setWorkOrders(workOrdersData);
        setIssueTypeData(issueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (
    reportId: string,
    status: "in progress" | "completed",
  ) => {
    try {
      const updatedReport = await apiService.updateReportStatus(
        reportId,
        status,
      );
      setReports(reports.map((r) => (r.id === reportId ? updatedReport : r)));
    } catch (err) {
      console.error("Error updating report status:", err);
      setError("Failed to update report status");
    }
  };

  // const [reports, setReports] = useState(mockReports);

  // const highSeverityReports = reports.filter((r) => r.severity >= 7).length;
  // const workOrdersCount = mockWorkOrders.reduce(
  //   (sum, wo) => sum + wo.totalReports,
  //   0,
  // );
  // const clusterCount = mockClusters.length;

  const handleViewAllReports = () => {
    navigate("/report-list");
  };

  const handleClusterClick = (clusterId: string) => {
    setSelectedClusterId(clusterId);
  };

  // const handleStatusChange = (
  //   reportId: string,
  //   status: "in progress" | "completed",
  // ) => {
  //   setReports(reports.map((r) => (r.id === reportId ? { ...r, status } : r)));
  // };

  // const selectedCluster = selectedClusterId
  //   ? mockClusters.find((c) => c.id === selectedClusterId)
  //   : null;
  const selectedCluster = selectedClusterId
    ? clusters.find((c) => c.id === selectedClusterId)
    : null;

  const highSeverityReports = reports.filter((r) => r.severity >= 7).length;
  const workOrdersCount = workOrders.reduce(
    (sum, wo) => sum + wo.totalReports,
    0,
  );
  const clusterCount = clusters.length;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 pt-20">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
              >
                Retry
              </button>
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
        <main className="flex-1 overflow-auto p-6 ">
          <div className="w-full mx-auto space-y-6">
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
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 z-10">
                <MapView
                  clusters={mockClusters}
                  reports={reports}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                />
              </div> */}
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
              {/* Priority Work Orders take 2/3 width */}
              <div className="lg:col-span-4">
                <PriorityWorkOrder
                  // workOrders={mockWorkOrders}
                  workOrders={workOrders}
                  onViewAllReports={handleViewAllReports}
                  onClusterClick={handleClusterClick}
                />
              </div>

              {/* Issue Type Chart takes 1/3 width */}
              <div className="lg:col-span-3">
                {/* <IssueTypeChart data={mockIssueTypeData} /> */}
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

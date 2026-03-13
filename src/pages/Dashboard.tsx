import React, { useState } from "react";
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
import { Report } from "../types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [reports, setReports] = useState(mockReports);

  const highSeverityReports = reports.filter((r) => r.severity >= 7).length;
  const workOrdersCount = mockWorkOrders.reduce(
    (sum, wo) => sum + wo.totalReports,
    0,
  );
  const clusterCount = mockClusters.length;

  const handleViewAllReports = () => {
    navigate("/report-list");
  };

  const handleClusterClick = (clusterId: string) => {
    setSelectedClusterId(clusterId);
  };

  const handleStatusChange = (
    reportId: string,
    status: "in progress" | "completed",
  ) => {
    setReports(reports.map((r) => (r.id === reportId ? { ...r, status } : r)));
  };

  const selectedCluster = selectedClusterId
    ? mockClusters.find((c) => c.id === selectedClusterId)
    : null;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
            <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 z-10">
                <MapView
                  clusters={mockClusters}
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
                  workOrders={mockWorkOrders}
                  onViewAllReports={handleViewAllReports}
                  onClusterClick={handleClusterClick}
                />
              </div>

              {/* Issue Type Chart takes 1/3 width */}
              <div className="lg:col-span-3">
                <IssueTypeChart data={mockIssueTypeData} />
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

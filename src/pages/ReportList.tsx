import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header.tsx";
import { Sidebar } from "../components/Layout/Sidebar.tsx";
import { ClusterReportModal } from "../components/Dashboard/ClusterReportModal.tsx";
import { mockReports, mockClusters } from "../data/mockData.ts";
import {
  filterReportsBySeverity,
  filterReportsByLocation,
  filterReportsByStatus,
  filterReportsByCluster,
  getSeverityLabel,
} from "../utils/helpers.ts";
import { Report } from "../types";

export const ReportList = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [reports, setReports] = useState(mockReports);
  const [locationInput, setLocationInput] = useState("");

  const filteredReports = useMemo(() => {
    let filtered = reports;
    filtered = filterReportsByStatus(filtered, statusFilter);
    filtered = filterReportsBySeverity(filtered, severityFilter);
    filtered = filterReportsByLocation(filtered, locationFilter);
    filtered = filterReportsByCluster(filtered, clusterFilter);
    return filtered;
  }, [reports, statusFilter, severityFilter, locationFilter, clusterFilter]);

  const handleLocationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLocationFilter(locationInput);
    }
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
        <main className="flex-1 overflow-auto p-6">
          <div className="w-full mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Status Tabs: full width */}
                <div className="md:col-span-3 mb-4">
                  <div className="flex gap-2">
                    {["all", "in progress", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-3 rounded text-sm font-medium transition-colors ${
                          statusFilter === status
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {status === "all"
                          ? "All"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Second Row: Severity, Location, Cluster */}
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyPress={handleLocationKeyPress}
                    placeholder="Enter location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="high">High (7-10)</option>
                    <option value="medium">Medium (4-6)</option>
                    <option value="low">Low (1-3)</option>
                  </select>
                </div>

                {/* Cluster Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cluster
                  </label>
                  <select
                    value={clusterFilter}
                    onChange={(e) => setClusterFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Clusters</option>
                    {mockClusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        Cluster {cluster.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#aca8a8] border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Report ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Issue Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Severity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Cluster ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Repair Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {report.id}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {report.location}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {report.issueType}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {report.severity}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {report.date}
                        </td>
                        <td
                          className="py-3 px-4 text-blue-600 font-medium cursor-pointer hover:underline"
                          onClick={() => setSelectedClusterId(report.clusterId)}
                        >
                          {report.clusterId}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(
                                report.id,
                                e.target.value as "in progress" | "completed",
                              )
                            }
                            className={`py-1 px-2 rounded border ${
                              report.status === "completed"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : "border-red-300 bg-red-50 text-red-700"
                            }`}
                          >
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No reports found matching your filters.
                </p>
              </div>
            )}
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

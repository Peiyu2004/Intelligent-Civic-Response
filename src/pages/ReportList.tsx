import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Layout/Header.tsx";
import { Sidebar } from "../components/Layout/Sidebar.tsx";
import { ClusterReportModal } from "../components/Dashboard/ClusterReportModal.tsx";
import {
  filterReportsBySeverity,
  filterReportsByLocation,
  filterReportsByStatus,
  filterReportsByCluster,
  getSeverityLabel,
} from "../utils/helpers.ts";
import { Report, Cluster } from "../types";
import apiService from "../services/apiService.ts";

export const ReportList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usesMockData, setUsesMockData] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching reports and clusters...");

      let reportsData: Report[] = [];
      let clustersData: Cluster[] = [];
      let usingMock = false;

      // Fetch Reports
      try {
        reportsData = await apiService.getReports();
        console.log("✅ Reports fetched:", reportsData.length);
      } catch (err) {
        console.warn("⚠️ Failed to fetch reports from API:", err);
        const { mockReports } = await import("../data/mockData.ts");
        reportsData = mockReports;
        usingMock = true;
      }

      // Fetch Clusters
      try {
        clustersData = await apiService.getClusters();
        console.log("✅ Clusters fetched:", clustersData.length);
      } catch (err) {
        console.warn("⚠️ Failed to fetch clusters from API:", err);
        const { mockClusters } = await import("../data/mockData.ts");
        clustersData = mockClusters;
        usingMock = true;
      }

      setReports(reportsData);
      setClusters(clustersData);
      setUsesMockData(usingMock);

      if (usingMock) {
        setError(
          "⚠️ Backend server not available. Using demo data. Make sure your Python backend is running at http://localhost:5000",
        );
      }
    } catch (err) {
      console.error("❌ Fatal error fetching data:", err);
      setError("Failed to load reports. Using demo data.");
      setReports([]);
      setClusters([]);
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
        console.log("👁️ Report List page became visible, refetching data...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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

  const handleStatusChange = async (
    reportId: string,
    status: "in progress" | "completed",
  ) => {
    try {
      const reportIdNum = parseInt(reportId);
      console.log(`📝 Changing report ${reportId} status to ${status}`);

      const updatedReport = await apiService.updateReportStatus(
        reportIdNum,
        status,
      );

      console.log("✅ Report updated successfully:", updatedReport);
      setReports(
        reports.map((r) => {
          if (r.id === reportId) {
            console.log("Updating report in state:", updatedReport);
            return updatedReport;
          }
          return r;
        }),
      );
    } catch (err) {
      console.error("❌ Error updating report status:", err);
      setError("Failed to update report status. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const selectedCluster = selectedClusterId
    ? clusters.find((c) => c.id === selectedClusterId)
    : null;

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
              <p className="text-gray-600">Loading reports...</p>
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
          <div className="w-full mx-auto">
            {/* Warning Banner - Demo Data */}
            {usesMockData && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
                <p className="text-yellow-800 text-sm font-medium">
                  ℹ️ <strong>Demo Mode:</strong> Using sample data. Backend
                  server not available.
                </p>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Status Tabs: full width */}
                <div className="md:col-span-3 mb-4">
                  <div className="flex gap-2 flex-wrap">
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

                {/* Second Row: Location, Severity, Cluster */}
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

                {/* Cluster Filter - Now using real clusters */}
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
                    {clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.location || `Cluster ${cluster.id}`}
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
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Report ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Issue Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Severity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Cluster ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-white">
                        Repair Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
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
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                report.severity >= 7
                                  ? "bg-red-100 text-red-800"
                                  : report.severity >= 4
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {report.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {report.date}
                          </td>
                          <td
                            className="py-3 px-4 text-blue-600 font-medium cursor-pointer hover:underline"
                            onClick={() =>
                              setSelectedClusterId(report.clusterId)
                            }
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
                              className={`py-1 px-2 rounded border font-medium transition ${
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 px-4 text-center">
                          <p className="text-gray-500">
                            No reports found matching your filters.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            {filteredReports.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Showing <strong>{filteredReports.length}</strong> of{" "}
                  <strong>{reports.length}</strong> reports
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

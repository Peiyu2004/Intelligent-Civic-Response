import React, { useState, useEffect } from "react";
import { Report, Cluster } from "../../types";
import { X } from "lucide-react";

interface ClusterReportModalProps {
  cluster: Cluster;
  reports: Report[];
  onClose: () => void;
  onStatusChange: (
    reportId: string,
    status: "in progress" | "completed",
  ) => void;
}

export const ClusterReportModal: React.FC<ClusterReportModalProps> = ({
  cluster,
  reports,
  onClose,
  onStatusChange,
}) => {
  // ✅ DEBUG: Log cluster ID and report cluster IDs
  useEffect(() => {
    console.log("🔍 Cluster ID:", cluster.id);
    console.log("🔍 Cluster ID Type:", typeof cluster.id);
    console.log("📋 All Reports:", reports);
    console.log(
      "📋 Reports with cluster IDs:",
      reports.map((r) => ({
        id: r.id,
        clusterId: r.clusterId,
        type: typeof r.clusterId,
      })),
    );

    const matching = reports.filter((r) => {
      const matches = r.clusterId === cluster.id;
      console.log(
        `📌 Report ${r.id}: clusterId=${r.clusterId}, cluster.id=${cluster.id}, matches=${matches}`,
      );
      return matches;
    });
    console.log("✅ Matching reports:", matching.length);
  }, [cluster.id, reports]);

  // ✅ FILTER REPORTS BY CLUSTER ID
  const clusterReports = reports.filter((r) => r.clusterId === cluster.id);

  // ✅ CALCULATE SEVERITY COUNTS FROM FILTERED REPORTS
  const highSeverity = clusterReports.filter((r) => r.severity >= 7).length;
  const mediumSeverity = clusterReports.filter(
    (r) => r.severity >= 4 && r.severity < 7,
  ).length;
  const lowSeverity = clusterReports.filter((r) => r.severity < 4).length;
  const averageSeverity =
    clusterReports.length > 0
      ? clusterReports.reduce((sum, r) => sum + r.severity, 0) /
        clusterReports.length
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[85%] max-w-5xl overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          {/* Row 1: Title + Close Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-black text-gray-900">
              Cluster Report {cluster.id}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl transition"
            >
              <X size={28} />
            </button>
          </div>

          {/* Row 2: Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex gap-1">
              <span className="text-gray-600">Total Reports:</span>
              <span className="font-semibold text-gray-900">
                {clusterReports.length}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">High Severity:</span>
              <span className="font-semibold text-red-600">{highSeverity}</span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Medium Severity:</span>
              <span className="font-semibold text-orange-600">
                {mediumSeverity}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Low Severity:</span>
              <span className="font-semibold text-green-600">
                {lowSeverity}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Average Severity:</span>
              <span className="font-semibold text-gray-900">
                {averageSeverity.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Row 3: Cluster Area */}
          <p className="text-sm text-gray-600 mt-3">
            <strong>Cluster Area:</strong> {cluster.location}
          </p>
        </div>

        {/* Table */}
        <div className="p-6">
          {clusterReports.length > 0 ? (
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
                      Repair Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clusterReports.map((report) => (
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
                      <td className="py-3 px-4 text-gray-700">{report.date}</td>
                      <td className="py-3 px-4">
                        <select
                          value={report.status}
                          onChange={(e) =>
                            onStatusChange(
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
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                ℹ️ No reports found for Cluster ID:{" "}
                <strong>{cluster.id}</strong>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Debug: Total reports available: {reports.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

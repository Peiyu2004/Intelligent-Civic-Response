import React, { useState } from "react";
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
  const clusterReports = reports.filter((r) => r.clusterId === cluster.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[85%] max-w-5xl overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          {/* Row 1: Title + Close Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-black text-gray-900">
              Cluster Report {cluster.id}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Row 2: Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex gap-1">
              <span className="text-gray-600">Total Reports:</span>
              <span className="font-semibold text-gray-900">
                {cluster.totalReports}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">High Severity:</span>
              <span className="font-semibold text-red-600">
                {cluster.highSeverity}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Medium Severity:</span>
              <span className="font-semibold text-orange-600">
                {cluster.mediumSeverity}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Low Severity:</span>
              <span className="font-semibold text-green-600">
                {cluster.lowSeverity}
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-gray-600">Average Severity:</span>
              <span className="font-semibold text-gray-900">
                {cluster.averageSeverity}
              </span>
            </div>
          </div>

          {/* Row 3: Cluster Area */}
          <p className="text-sm text-gray-600 mt-3">
            Cluster Area: {cluster.location}
          </p>
        </div>

        {/* Table */}
        <div className="p-6">
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
                    Repair Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {clusterReports.map((report) => (
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
      </div>
    </div>
  );
};

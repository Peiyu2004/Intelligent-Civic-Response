import React from "react";
import { Report } from "../../types";
import { getSeverityLabel } from "../../utils/helpers.ts";

interface ReportDetailCardProps {
  report: Report;
  onViewDetail: (report: Report) => void;
}

export const ReportDetailCard: React.FC<ReportDetailCardProps> = ({
  report,
  onViewDetail,
}) => {
  return (
    <div className="bg-white h-full rounded-3xl border-2 border-black p-6 shadow-lg">
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-4xl">
            📍
          </div>
          <div>
            <p className="font-extrabold text-gray-900">{report.location}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Issue :</span>
          <span className="font-medium text-gray-900">{report.issueType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Severity :</span>
          <span className="font-medium text-gray-900">
            {report.severity} ({getSeverityLabel(report.severity)})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cluster :</span>
          <span className="font-medium text-black underline cursor-pointer">
            {report.clusterId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date :</span>
          <span className="font-medium text-gray-900">{report.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status :</span>
          <span
            className={`font-medium ${
              report.status === "completed" ? "text-green-500" : "text-red-500"
            }`}
          >
            {report.status}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewDetail(report)}
        className="w-full bg-[#6750A4] hover:bg-[#7f65c5] text-white font-medium py-2 px-4 rounded-xl transition-colors"
      >
        View Cluster
      </button>
    </div>
  );
};

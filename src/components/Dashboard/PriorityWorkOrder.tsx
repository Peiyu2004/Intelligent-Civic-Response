import React, { useEffect } from "react";
import { WorkOrder, Report, Cluster } from "../../types";
import { useNavigate } from "react-router-dom";

interface PriorityWorkOrderProps {
  workOrders: WorkOrder[];
  reports?: Report[];
  clusters?: Cluster[];
  onViewAllReports: () => void;
  onClusterClick: (clusterId: string) => void;
}

export const PriorityWorkOrder: React.FC<PriorityWorkOrderProps> = ({
  workOrders,
  reports = [],
  clusters = [],
  onViewAllReports,
  onClusterClick,
}) => {
  const navigate = useNavigate();

  // ✅ DEBUG: Log work orders structure
  useEffect(() => {
    console.log("🔍 Work Orders:", workOrders);
    workOrders.forEach((wo) => {
      console.log(`📌 Work Order ${wo.id}:`, {
        id: wo.id,
        cluster_id: wo.cluster_id,
        totalReports: wo.totalReports,
        allKeys: Object.keys(wo),
      });
    });
  }, [workOrders]);

  // ✅ FUNCTION TO GET ACTUAL REPORT COUNT FOR A WORK ORDER
  const getReportCountForWorkOrder = (workOrder: WorkOrder) => {
    console.log(`Checking workOrder ${workOrder.id}:`, {
      cluster_id: workOrder.cluster_id,
      type: typeof workOrder.cluster_id,
    });

    // Try both cluster_id and totalReports
    const clusterId = workOrder.cluster_id;
    if (!clusterId) {
      console.log(
        `❌ No cluster_id for work order ${workOrder.id}, returning 0`,
      );
      return 0;
    }

    // Count reports belonging to this cluster
    const reportCount = reports.filter((r) => {
      const matches = r.clusterId === clusterId;
      if (matches) {
        console.log(`✅ Report ${r.id} matches cluster ${clusterId}`);
      }
      return matches;
    }).length;

    console.log(`Final count for work order ${workOrder.id}:`, reportCount);
    return reportCount > 0 ? reportCount : 0;
  };

  return (
    <div className="bg-white h-full rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Priority Work Order</h2>
        <button
          onClick={onViewAllReports}
          className="bg-[#6750A4] hover:bg-[#7f65c5] text-white text-sm font-medium py-3 px-5 rounded-xl transition-colors"
        >
          View All Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Work Order ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Priority Level
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Assigned Team
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Total Reports
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Repair Status
              </th>
            </tr>
          </thead>
          <tbody>
            {workOrders.length > 0 ? (
              workOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {order.priorityLevel}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {order.assignedTeam}
                  </td>
                  <td
                    className="py-3 px-4 text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => onClusterClick(order.cluster_id || order.id)}
                  >
                    {getReportCountForWorkOrder(order)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        order.status === "completed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                  No work orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

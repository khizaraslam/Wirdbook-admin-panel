import React from "react";
import { BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";
import type { DhikrAssignmentDTO } from "@/utils/helpers/models/communities/dhikr-assignment.dto";
import {
  ASSIGNMENT_STATUS_STYLES,
  formatAssignmentStatus,
  formatAssignmentType,
  formatDate,
  formatDateTime,
} from "@/utils/helpers/communities/dhikr-helpers";

interface DhikrAssignmentsTableProps {
  assignments: DhikrAssignmentDTO[];
  selectedId: string | null;
  onViewReport: (assignment: DhikrAssignmentDTO) => void;
}

const DhikrAssignmentsTable: React.FC<DhikrAssignmentsTableProps> = ({
  assignments,
  selectedId,
  onViewReport,
}) => {
  const columns = [
    "Dhikr",
    "Type",
    "Total target",
    "Pool remaining",
    "Completed",
    "Status",
    "Expires at",
    "Period",
    "Created",
    "Actions",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Assignment history
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {assignments.length} tasks
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-gray-400"
                >
                  No dhikr tasks created yet
                </td>
              </tr>
            ) : (
              assignments.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    selectedId === item.id ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {item.dhikrName || "—"}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {formatAssignmentType(item.assignmentType)}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {item.totalTarget}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {item.poolRemaining}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {item.completedTotal}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ASSIGNMENT_STATUS_STYLES[item.status]}`}
                    >
                      {formatAssignmentStatus(item.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {formatDateTime(item.expiresAt)}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {item.periodStart || item.periodEnd
                      ? `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`
                      : "—"}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReport(item)}
                      title="View report"
                    >
                      <BarChart3 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DhikrAssignmentsTable;

import React from "react";
import type { DhikrReportDTO } from "@/utils/helpers/models/communities/dhikr-assignment.dto";
import { CLAIM_STATUS_STYLES } from "@/utils/helpers/communities/dhikr-helpers";

interface DhikrReportTableProps {
  report: DhikrReportDTO | null;
  isLoading?: boolean;
}

const DhikrReportTable: React.FC<DhikrReportTableProps> = ({
  report,
  isLoading,
}) => {
  const columns = [
    "Member",
    "Taken",
    "Progress",
    "Remaining",
    "Status",
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-sm">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Member report
          {report.dhikrName ? ` — ${report.dhikrName}` : ""}
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {report.claims.length} claims · completed total:{" "}
          {report.completedTotal} / {report.totalTarget}
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
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
            {report.claims.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-gray-400"
                >
                  No members have taken from this pool yet
                </td>
              </tr>
            ) : (
              report.claims.map((claim, index) => (
                <tr
                  key={claim.userId ?? `${claim.userName}-${index}`}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {claim.userName}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {claim.claimedQuantity}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {claim.currentProgress}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {claim.remaining}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${CLAIM_STATUS_STYLES[claim.status]}`}
                    >
                      {claim.status}
                    </span>
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

export default DhikrReportTable;

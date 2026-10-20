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
  const isKhitma = report?.claims.some(
    (claim) => claim.juzNumbers?.length || claim.completedJuz || claim.pendingJuz,
  );
  const columns = [
    "Member",
    "Taken",
    isKhitma ? "Read" : "Progress",
    isKhitma ? "Left" : "Remaining",
    "Status",
  ];

  if (isLoading) {
    return <p className="text-gray-400 text-sm py-6">Loading report...</p>;
  }

  if (!report) {
    return (
      <p className="text-gray-400 text-sm py-6">No report available.</p>
    );
  }

  return (
    <div className="overflow-hidden">
      <p className="text-gray-500 text-sm mb-4">
        {report.claims.length} claims · completed total:{" "}
        {report.completedTotal} / {report.totalTarget}
      </p>
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
                    {claim.juzNumbers?.length
                      ? claim.juzNumbers.join(", ")
                      : claim.claimedQuantity}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {claim.completedJuz
                      ? claim.completedJuz.length
                        ? claim.completedJuz.join(", ")
                        : "—"
                      : claim.currentProgress}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {claim.pendingJuz
                      ? claim.pendingJuz.length
                        ? claim.pendingJuz.join(", ")
                        : "—"
                      : claim.remaining}
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

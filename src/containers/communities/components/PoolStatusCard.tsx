import React from "react";
import type { DhikrAssignmentDTO } from "@/utils/helpers/models/communities/dhikr-assignment.dto";
import {
  ASSIGNMENT_STATUS_STYLES,
  formatAssignmentStatus,
  formatAssignmentType,
  formatDate,
  formatDateTime,
} from "@/utils/helpers/communities/dhikr-helpers";

interface PoolStatusCardProps {
  assignment: DhikrAssignmentDTO | null;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </p>
    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const PoolStatusCard: React.FC<PoolStatusCardProps> = ({ assignment }) => {
  if (!assignment) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Pool status</h2>
        <p className="text-gray-400 text-sm mt-2">
          No dhikr tasks yet. Create a community pool task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pool status</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {assignment.dhikrName || "Dhikr task"} ·{" "}
            {formatAssignmentType(assignment.assignmentType)}
          </p>
        </div>
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ASSIGNMENT_STATUS_STYLES[assignment.status]}`}
        >
          {formatAssignmentStatus(assignment.status)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold text-gray-900">
            {assignment.progressPercent}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{
              width: `${Math.min(100, Math.max(0, assignment.progressPercent))}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatItem label="Total target" value={assignment.totalTarget} />
        <StatItem label="Available in pool" value={assignment.poolRemaining} />
        <StatItem label="Taken by members" value={assignment.claimedTotal} />
        <StatItem label="Completed" value={assignment.completedTotal} />
      </div>

      {(assignment.periodStart || assignment.periodEnd) && (
        <p className="text-sm text-gray-500 mt-4">
          Period: {formatDate(assignment.periodStart)} —{" "}
          {formatDate(assignment.periodEnd)}
        </p>
      )}
      {assignment.expiresAt && (
        <p className="text-sm text-gray-500 mt-2">
          Expires at: {formatDateTime(assignment.expiresAt)}
        </p>
      )}
      {assignment.carriedOver != null && assignment.carriedOver > 0 && (
        <p className="text-sm text-amber-700 mt-2">
          Carried over from previous week: {assignment.carriedOver}
        </p>
      )}
    </div>
  );
};

export default PoolStatusCard;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import useCommunityDhikr from "../useDhikrHooks";
import useDhikrTypes from "@/containers/dhikr-types/useHooks";
import CreateDhikrTaskModal from "./CreateDhikrTaskModal";
import PoolStatusCard from "./PoolStatusCard";
import DhikrAssignmentsTable from "./DhikrAssignmentsTable";
import DhikrReportTable from "./DhikrReportTable";
import type { DhikrAssignmentDTO } from "@/utils/helpers/models/communities/dhikr-assignment.dto";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";
import type { CreateDhikrAssignmentBody } from "@/utils/helpers/models/communities/dhikr-assignment.dto";

interface CommunityDhikrTabProps {
  communityId: string;
}

const CommunityDhikrTab: React.FC<CommunityDhikrTabProps> = ({
  communityId,
}) => {
  const { getAssignments, createAssignment, getReport } = useCommunityDhikr();
  const { getAll: getDhikrTypes } = useDhikrTypes();
  const [assignments, setAssignments] = useState<DhikrAssignmentDTO[]>([]);
  const [dhikrTypes, setDhikrTypes] = useState<DhikrTypeDTO[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<DhikrAssignmentDTO | null>(null);
  const [report, setReport] = useState<Awaited<ReturnType<typeof getReport>>>(
    null,
  );
  const [reportLoading, setReportLoading] = useState(false);
  const hasActiveDhikrTypes = dhikrTypes.some((item) => item.status === "active");

  const loadAssignments = useCallback(async () => {
    const data = await getAssignments(communityId);
    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setAssignments(sorted);
    return sorted;
  }, [communityId, getAssignments]);

  const loadDhikrTypes = useCallback(async () => {
    const data = await getDhikrTypes();
    setDhikrTypes(data);
  }, [getDhikrTypes]);

  useEffect(() => {
    loadAssignments();
    loadDhikrTypes();
  }, [loadAssignments, loadDhikrTypes]);

  const activePoolAssignment = useMemo(() => {
    const active = assignments.find(
      (a) => a.status === "open" || a.status === "in_progress",
    );
    return active ?? assignments[0] ?? null;
  }, [assignments]);

  const handleCreate = async (body: CreateDhikrAssignmentBody) => {
    const ok = await createAssignment(communityId, body);
    if (ok) {
      const updated = await loadAssignments();
      if (updated[0]) {
        setSelectedAssignment(updated[0]);
        await loadReport(updated[0].id);
      }
    }
    return ok;
  };

  const loadReport = async (assignmentId: string) => {
    setReportLoading(true);
    const data = await getReport(communityId, assignmentId);
    setReport(data);
    setReportLoading(false);
  };

  const handleViewReport = async (assignment: DhikrAssignmentDTO) => {
    setSelectedAssignment(assignment);
    await loadReport(assignment.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Community dhikr</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Create pool tasks — members take portions in the mobile app
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          disabled={!hasActiveDhikrTypes}
          title={
            hasActiveDhikrTypes
              ? "Create community dhikr task"
              : "Create an active dhikr type first"
          }
        >
          <Plus size={18} className="mr-2" />
          Create community dhikr task
        </Button>
      </div>

      {!hasActiveDhikrTypes && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Dhikr task create karne se pehle kam az kam 1 active dhikr type
            zaroori hai. Pehle `Dhikr Types` page se type add/activate karein.
          </p>
        </div>
      )}

      <PoolStatusCard assignment={activePoolAssignment} />

      <DhikrAssignmentsTable
        assignments={assignments}
        selectedId={selectedAssignment?.id ?? null}
        onViewReport={handleViewReport}
      />

      {(selectedAssignment || reportLoading) && (
        <DhikrReportTable report={report} isLoading={reportLoading} />
      )}

      <CreateDhikrTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        dhikrTypes={dhikrTypes}
      />
    </div>
  );
};

export default CommunityDhikrTab;

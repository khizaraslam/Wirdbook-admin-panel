import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
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
  const {
    getAssignments,
    createAssignment,
    pauseAssignment,
    resumeAssignment,
    deleteAssignment,
    getReport,
  } = useCommunityDhikr();
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
  const [actingId, setActingId] = useState<string | null>(null);
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

  const openPools = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.status === "open" ||
          a.status === "in_progress" ||
          a.status === "paused",
      ),
    [assignments],
  );

  const handleCreate = async (body: CreateDhikrAssignmentBody) => {
    const ok = await createAssignment(communityId, body);
    if (ok) {
      await loadAssignments();
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

  const handlePause = async (assignment: DhikrAssignmentDTO) => {
    const weekly = assignment.assignmentType === "weekly";
    const result = await confirmationPopup(
      weekly ? "Pause this weekly task?" : "Pause this task?",
      weekly
        ? "Members cannot add progress. On the week end date this task ends and the next week is not created. Resume before that date if it should continue."
        : "Members cannot add progress until you resume it.",
    );
    if (!result.isConfirmed) return;
    setActingId(assignment.id);
    const ok = await pauseAssignment(communityId, assignment.id);
    setActingId(null);
    if (ok) await loadAssignments();
  };

  const handleResume = async (assignment: DhikrAssignmentDTO) => {
    const result = await confirmationPopup(
      "Resume this task?",
      assignment.assignmentType === "weekly"
        ? "Members can take portions again. If this week is still open, the next week will be created when it ends."
        : "Members can take portions again.",
    );
    if (!result.isConfirmed) return;
    setActingId(assignment.id);
    const ok = await resumeAssignment(communityId, assignment.id);
    setActingId(null);
    if (ok) await loadAssignments();
  };

  const handleDelete = async (assignment: DhikrAssignmentDTO) => {
    const result = await confirmationPopup(
      "Remove this task from the admin panel?",
      `${assignment.dhikrName || "This task"} closes and disappears from this list. Members keep the usage they already recorded.`,
    );
    if (!result.isConfirmed) return;
    setActingId(assignment.id);
    const ok = await deleteAssignment(communityId, assignment.id);
    setActingId(null);
    if (ok) {
      if (selectedAssignment?.id === assignment.id) {
        setSelectedAssignment(null);
        setReport(null);
      }
      await loadAssignments();
    }
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
            Create at least one active dhikr type before creating a dhikr
            task. Add or activate a type on the Dhikr Types page first.
          </p>
        </div>
      )}

      <PoolStatusCard assignments={openPools} />

      <DhikrAssignmentsTable
        assignments={assignments}
        selectedId={selectedAssignment?.id ?? null}
        actingId={actingId}
        onViewReport={handleViewReport}
        onPause={handlePause}
        onResume={handleResume}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => {
          setSelectedAssignment(null);
          setReport(null);
        }}
        title={
          selectedAssignment
            ? `Member report — ${selectedAssignment.dhikrName || "Dhikr"}`
            : "Member report"
        }
        className="max-w-4xl"
      >
        <DhikrReportTable report={report} isLoading={reportLoading} />
      </Modal>

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

import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Communities_APIS } from "@/libs/apis/communities.api";
import type {
  CreateDhikrAssignmentBody,
  DhikrAssignmentDTO,
  DhikrReportDTO,
} from "@/utils/helpers/models/communities/dhikr-assignment.dto";

const useCommunityDhikr = () => {
  const getAssignments = useCallback(
    async (communityId: string): Promise<DhikrAssignmentDTO[]> => {
      const response = await Communities_APIS.getDhikrAssignments(communityId);
      const { success = false, data = null } = response || {};
      if (success && Array.isArray(data)) return data as DhikrAssignmentDTO[];
      return [];
    },
    [],
  );

  const createAssignment = useCallback(
    async (communityId: string, body: CreateDhikrAssignmentBody) => {
      const response = await Communities_APIS.createDhikrAssignment(
        communityId,
        body,
      );
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(
          message ||
            "Community dhikr task created. Members can now take portions from the pool.",
        );
        return true;
      }
      errorToaster(
        message || response?.error || "Failed to create community dhikr task",
      );
      return false;
    },
    [],
  );

  const pauseAssignment = useCallback(
    async (communityId: string, assignmentId: string) => {
      const response = await Communities_APIS.pauseDhikrAssignment(
        communityId,
        assignmentId,
      );
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Community dhikr task paused.");
        return true;
      }
      errorToaster(message || response?.error || "Failed to pause dhikr task");
      return false;
    },
    [],
  );

  const resumeAssignment = useCallback(
    async (communityId: string, assignmentId: string) => {
      const response = await Communities_APIS.resumeDhikrAssignment(
        communityId,
        assignmentId,
      );
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Community dhikr task resumed.");
        return true;
      }
      errorToaster(message || response?.error || "Failed to resume dhikr task");
      return false;
    },
    [],
  );

  const deleteAssignment = useCallback(
    async (communityId: string, assignmentId: string) => {
      const response = await Communities_APIS.deleteDhikrAssignment(
        communityId,
        assignmentId,
      );
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(
          message ||
            "Task removed from the admin panel. Member usage history is kept.",
        );
        return true;
      }
      errorToaster(message || response?.error || "Failed to delete dhikr task");
      return false;
    },
    [],
  );

  const getReport = useCallback(
    async (
      communityId: string,
      assignmentId: string,
    ): Promise<DhikrReportDTO | null> => {
      const response = await Communities_APIS.getDhikrReport(
        communityId,
        assignmentId,
      );
      const { success = false, data = null } = response || {};
      if (success && data) return data as DhikrReportDTO;
      return null;
    },
    [],
  );

  return {
    getAssignments,
    createAssignment,
    pauseAssignment,
    resumeAssignment,
    deleteAssignment,
    getReport,
  };
};

export default useCommunityDhikr;

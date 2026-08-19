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

  return { getAssignments, createAssignment, getReport };
};

export default useCommunityDhikr;

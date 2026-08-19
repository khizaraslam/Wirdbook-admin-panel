import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Communities_APIS } from "@/libs/apis/communities.api";
import type {
  CommunityDTO,
  CommunityMemberDTO,
} from "@/utils/helpers/models/communities/community.dto";

const useCommunities = () => {
  const getAll = useCallback(async (): Promise<CommunityDTO[]> => {
    const response = await Communities_APIS.getAll();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) return data as CommunityDTO[];
    return [];
  }, []);

  const getOne = useCallback(async (id: string): Promise<CommunityDTO | null> => {
    const response = await Communities_APIS.getOne(id);
    const { success = false, data = null } = response || {};
    if (success && data) return data as CommunityDTO;
    return null;
  }, []);

  const create = useCallback(async (name: string) => {
    const response = await Communities_APIS.create({ name });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community created successfully");
      return true;
    }
    errorToaster(message || response?.error || "Failed to create community");
    return false;
  }, []);

  const update = useCallback(async (id: string, name: string) => {
    const response = await Communities_APIS.update(id, { name });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community updated successfully");
      return true;
    }
    errorToaster(message || response?.error || "Failed to update community");
    return false;
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: "active" | "inactive") => {
      const response = await Communities_APIS.updateStatus(id, { status });
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(
          message ||
            `Community ${status === "active" ? "activated" : "deactivated"}`,
        );
        return true;
      }
      errorToaster(message || response?.error || "Failed to update status");
      return false;
    },
    [],
  );

  const assignAdmin = useCallback(async (id: string, userId: string) => {
    const response = await Communities_APIS.assignAdmin(id, { userId });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community admin assigned successfully");
      return true;
    }
    if (response?.statusCode === 409) {
      errorToaster(
        message ||
          "User is already an active member of another community",
      );
      return false;
    }
    errorToaster(message || response?.error || "Failed to assign admin");
    return false;
  }, []);

  const getMembers = useCallback(
    async (id: string): Promise<CommunityMemberDTO[]> => {
      const response = await Communities_APIS.getMembers(id);
      const { success = false, data = null } = response || {};
      if (success && Array.isArray(data)) return data as CommunityMemberDTO[];
      return [];
    },
    [],
  );

  return {
    getAll,
    getOne,
    create,
    update,
    updateStatus,
    assignAdmin,
    getMembers,
  };
};

export default useCommunities;

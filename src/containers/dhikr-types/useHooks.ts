import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { DhikrTypes_APIS } from "@/libs/apis/dhikr-types.api";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";

const useDhikrTypes = () => {
  const getAll = useCallback(async (): Promise<DhikrTypeDTO[]> => {
    const response = await DhikrTypes_APIS.getAll();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) return data as DhikrTypeDTO[];
    return [];
  }, []);

  const create = useCallback(
    async (body: {
      name: string;
      nameAr: string;
      description?: string;
      sortOrder?: number;
    }) => {
      const response = await DhikrTypes_APIS.create(body);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Dhikr type created successfully");
        return true;
      }
      errorToaster(message || response?.error || "Failed to create dhikr type");
      return false;
    },
    [],
  );

  const update = useCallback(
    async (
      id: string,
      body: Partial<{
        name: string;
        nameAr: string;
        description: string | null;
        status: "active" | "inactive";
        sortOrder: number;
      }>,
    ) => {
      const response = await DhikrTypes_APIS.update(id, body);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Dhikr type updated successfully");
        return true;
      }
      errorToaster(message || response?.error || "Failed to update dhikr type");
      return false;
    },
    [],
  );

  return { getAll, create, update };
};

export default useDhikrTypes;

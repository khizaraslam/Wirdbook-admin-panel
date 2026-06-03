import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { SyncModules_APIS } from "@/libs/apis/sync-modules.api";
import { SyncModuleDTO } from "@/utils/helpers/models/sync/sync-module.dto";

const useSyncModules = () => {
  const getAllModules = async (setData: (data: SyncModuleDTO[]) => void) => {
    const response = await SyncModules_APIS.getAllModules();
    const { success = false, data = null } = response || {};
    if (success) {
      setData(data || []);
    }
  };

  const updateModuleTime = async (id: string) => {
    const response = await SyncModules_APIS.updateModuleTime(id);
    const { success = false, data = null, message = "" } = response || {};

    if (success) {
      successToaster(message || "Module sync time updated successfully.");
      return data as SyncModuleDTO;
    }

    errorToaster(message || "Failed to update sync time");
    return null;
  };

  const deleteModule = async (id: string) => {
    const response = await SyncModules_APIS.deleteModule(id);
    const { success = false, data = null, message = "" } = response || {};

    if (success) {
      successToaster(message || "Module deleted successfully.");
      return data as Pick<SyncModuleDTO, "id" | "name">;
    }

    errorToaster(message || "Failed to delete module");
    return null;
  };

  return {
    getAllModules,
    updateModuleTime,
    deleteModule,
  };
};

export default useSyncModules;


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
      const modules = (data || []).filter(
        (module: SyncModuleDTO) => module.name !== "books",
      );
      setData(modules);
    }
  };

  const updateModuleTime = async (id: string, file?: File) => {
    const response = await SyncModules_APIS.updateModuleTime(id, file);
    const { success = false, data = null, message = "" } = response || {};

    if (success) {
      const syncMessage =
        data?.content_path
          ? "JSON saved. Mobile clients will pick up changes on next sync."
          : message || "Module sync time updated successfully.";
      successToaster(syncMessage);
      return data as SyncModuleDTO;
    }

    if (!response?.error) {
      errorToaster(message || "Failed to update sync time");
    }
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

  const downloadModule = async (idOrName: string, fallbackName: string) => {
    try {
      const { blob, filename } = await SyncModules_APIS.downloadModule(
        idOrName,
        fallbackName,
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error: any) {
      const status = error?.response?.status;
      errorToaster(
        status === 404
          ? "JSON file has not been uploaded yet"
          : "Failed to download JSON file",
      );
      return false;
    }
  };

  return {
    getAllModules,
    updateModuleTime,
    deleteModule,
    downloadModule,
  };
};

export default useSyncModules;


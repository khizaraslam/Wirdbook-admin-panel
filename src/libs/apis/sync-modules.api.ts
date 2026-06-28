import {
  deleteRequest,
  getRequest,
  patchRequest,
} from "../../utils/helpers/common/http-methods";

export const SyncModules_APIS = {
  getAllModules: () => getRequest("/api/sync/modules"),
  updateModuleTime: (id: string, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      return patchRequest(`/api/admin/sync/modules/${id}/time`, formData);
    }
    return patchRequest(`/api/admin/sync/modules/${id}/time`, {});
  },
  deleteModule: (id: string) => deleteRequest(`/api/admin/sync/modules/${id}`),
};


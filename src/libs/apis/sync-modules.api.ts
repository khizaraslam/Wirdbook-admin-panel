import {
  deleteRequest,
  getRequest,
  patchRequest,
} from "../../utils/helpers/common/http-methods";

export const SyncModules_APIS = {
  getAllModules: () => getRequest("/api/sync/modules"),
  updateModuleTime: (id: string) =>
    patchRequest(`/api/admin/sync/modules/${id}/time`, {}),
  deleteModule: (id: string) => deleteRequest(`/api/admin/sync/modules/${id}`),
};


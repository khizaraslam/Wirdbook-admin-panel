import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "../../utils/helpers/common/http-methods";

export const Tabs_APIS = {
  getAllTabs: () => getRequest("/api/admin/tabs"),
  addTab: (body: AddTabDTO) => postRequest("/api/admin/tabs", body),
  updateTab: (id: string, params: AddTabDTO) => putRequest(`/api/admin/tabs/${id}`, params),
  reorderTabs: (body: any) => patchRequest("/api/admin/tabs/reorder", body),
    deleteTab: (id: string | number) => deleteRequest(`/api/admin/tabs/${id}`),
};

import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import type { ContentType } from "@/utils/helpers/enums/content-type.enum";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const Tabs_APIS = {
  getAllTabs: (type?: ContentType) =>
    getRequest("/api/admin/tabs", type ? { type } : {}),
  addTab: (body: AddTabDTO) => postRequest("/api/admin/tabs", body),
  updateTab: (id: string, params: AddTabDTO) =>
    putRequest(`/api/admin/tabs/${id}`, params),
  reorderTabs: (type: ContentType, body: { tabIds: string[] }) =>
    patchRequest(`/api/admin/tabs/reorder/${type}`, body),
  deleteTab: (id: string | number) => deleteRequest(`/api/admin/tabs/${id}`),
};

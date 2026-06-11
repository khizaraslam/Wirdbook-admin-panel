import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";
import type { WirdFormBody } from "@/utils/helpers/models/qasidas/qasida.dto";

export const Qasidas_APIS = {
  getSettings: () => getRequest("/api/admin/qasidas/settings"),
  updateSettings: (body: {
    titleEn?: string;
    titleAr?: string;
    infoEn?: string;
    infoAr?: string;
  }) => putRequest("/api/admin/qasidas/settings", body),

  list: (params?: { page?: number; limit?: number; search?: string }) =>
    getRequest("/api/admin/qasidas", params),
  getOne: (id: string) => getRequest(`/api/admin/qasidas/${id}`),
  create: (body: FormData) => postRequest("/api/admin/qasidas", body),
  update: (id: string, body: FormData) =>
    patchRequest(`/api/admin/qasidas/${id}`, body),
  remove: (id: string) => deleteRequest(`/api/admin/qasidas/${id}`),
  reorder: (ids: string[]) =>
    patchRequest("/api/admin/qasidas/reorder", { ids }),

  listWirds: (
    qasidaId: string,
    params?: { page?: number; limit?: number },
  ) => getRequest(`/api/admin/qasidas/${qasidaId}/wirds`, params),
  createWird: (qasidaId: string, body: WirdFormBody) =>
    postRequest(`/api/admin/qasidas/${qasidaId}/wirds`, body),
  updateWird: (qasidaId: string, wirdId: string, body: WirdFormBody) =>
    patchRequest(`/api/admin/qasidas/${qasidaId}/wirds/${wirdId}`, body),
  removeWird: (qasidaId: string, wirdId: string) =>
    deleteRequest(`/api/admin/qasidas/${qasidaId}/wirds/${wirdId}`),
  reorderWirds: (qasidaId: string, ids: string[]) =>
    patchRequest(`/api/admin/qasidas/${qasidaId}/wirds/reorder`, { ids }),
  bulkUploadWirds: (qasidaId: string, file: File, replace = false) => {
    const form = new FormData();
    form.append("file", file);
    if (replace) form.append("replace", "true");
    return postRequest(
      `/api/admin/qasidas/${qasidaId}/wirds/bulk-upload`,
      form,
    );
  },
};

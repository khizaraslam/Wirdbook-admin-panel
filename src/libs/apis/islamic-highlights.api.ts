import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const IslamicHighlights_APIS = {
  getAll: () => getRequest("/api/admin/islamic-highlights"),
  getOne: (id: string) => getRequest(`/api/admin/islamic-highlights/${id}`),
  create: (body: FormData) => postRequest("/api/admin/islamic-highlights", body),
  update: (id: string, body: FormData) =>
    putRequest(`/api/admin/islamic-highlights/${id}`, body),
  partialUpdate: (id: string, body: FormData) =>
    patchRequest(`/api/admin/islamic-highlights/${id}`, body),
  reorder: (body: { highlightIds: string[] }) =>
    patchRequest("/api/admin/islamic-highlights/reorder", body),
  delete: (id: string) => deleteRequest(`/api/admin/islamic-highlights/${id}`),
};

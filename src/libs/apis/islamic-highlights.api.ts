import { CreateIslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/create-islamic-highlight-tag.dto";
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

  getTags: () => getRequest("/api/admin/islamic-highlights/tags"),
  createTag: (body: CreateIslamicHighlightTagDTO) =>
    postRequest("/api/admin/islamic-highlights/tags", body),
  updateTag: (id: string, body: CreateIslamicHighlightTagDTO) =>
    putRequest(`/api/admin/islamic-highlights/tags/${id}`, body),
  deleteTag: (id: string) =>
    deleteRequest(`/api/admin/islamic-highlights/tags/${id}`),
};

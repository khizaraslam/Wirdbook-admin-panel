import { CreateQaItemDTO } from "@/utils/helpers/models/qa/create-qa-item.dto";
import { CreateQaTagDTO } from "@/utils/helpers/models/qa/create-qa-tag.dto";
import { UpdateQaItemDTO } from "@/utils/helpers/models/qa/update-qa-item.dto";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const Qa_APIS = {
  getItems: (params: Record<string, unknown> = {}) =>
    getRequest("/api/admin/qa", params),
  getItem: (id: string) => getRequest(`/api/admin/qa/${id}`),
  createItem: (body: CreateQaItemDTO) => postRequest("/api/admin/qa", body),
  updateItem: (id: string, body: UpdateQaItemDTO) =>
    putRequest(`/api/admin/qa/${id}`, body),
  deleteItem: (id: string) => deleteRequest(`/api/admin/qa/${id}`),
  publishItem: (id: string) => patchRequest(`/api/admin/qa/${id}/publish`, {}),
  unpublishItem: (id: string) =>
    patchRequest(`/api/admin/qa/${id}/unpublish`, {}),

  getTags: () => getRequest("/api/admin/qa/tags"),
  getTag: (id: string) => getRequest(`/api/admin/qa/tags/${id}`),
  createTag: (body: CreateQaTagDTO) => postRequest("/api/admin/qa/tags", body),
  updateTag: (id: string, body: CreateQaTagDTO) =>
    putRequest(`/api/admin/qa/tags/${id}`, body),
  deleteTag: (id: string) => deleteRequest(`/api/admin/qa/tags/${id}`),
};

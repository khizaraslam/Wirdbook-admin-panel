import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "../../utils/helpers/common/http-methods";

export const Lectures_APIS = {
  getAllLectures: (params: any = {}) => getRequest("/api/admin/lectures", params),
  addLecture: (body: FormData) => postRequest("/api/admin/lectures", body),
  updateLecture: (id: string, body: FormData) => putRequest(`/api/admin/lectures/${id}`, body),
  partialUpdateLecture: (id: string, body: FormData) => patchRequest(`/api/admin/lectures/${id}`, body),
  deleteLecture: (id: string) => deleteRequest(`/api/admin/lectures/${id}`),
  assignTab: (id: string, body: { tabId: string }) => postRequest(`/api/admin/lectures/${id}/assign-tab`, body),
  bulkAssignTabs: (body: { lectureIds: (string)[]; tabId: string }) => postRequest("/api/admin/lectures/bulk-assign", body),
};

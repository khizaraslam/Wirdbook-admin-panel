import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";
import type { CreateDhikrAssignmentBody } from "../../utils/helpers/models/communities/dhikr-assignment.dto";

export const Communities_APIS = {
  getAll: () => getRequest("/api/admin/communities"),
  getOne: (id: string) => getRequest(`/api/admin/communities/${id}`),
  create: (body: FormData) => postRequest("/api/admin/communities", body),
  update: (id: string, body: FormData) =>
    patchRequest(`/api/admin/communities/${id}`, body),
  updateStatus: (id: string, body: { status: "active" | "inactive" }) =>
    patchRequest(`/api/admin/communities/${id}/status`, body),
  assignAdmin: (id: string, body: { userId: string }) =>
    putRequest(`/api/admin/communities/${id}/admin`, body),
  getMembers: (id: string) =>
    getRequest(`/api/admin/communities/${id}/members`),
  createDhikrAssignment: (
    communityId: string,
    body: CreateDhikrAssignmentBody,
  ) => postRequest(`/api/admin/communities/${communityId}/dhikr/assign`, body),
  getDhikrAssignments: (communityId: string) =>
    getRequest(`/api/admin/communities/${communityId}/dhikr/assignments`),
  getDhikrReport: (communityId: string, assignmentId?: string) => {
    const query = assignmentId ? `?assignmentId=${assignmentId}` : "";
    return getRequest(
      `/api/admin/communities/${communityId}/dhikr/report${query}`,
    );
  },
  updateNoticeboardPost: (
    communityId: string,
    postId: string,
    body: FormData,
  ) =>
    patchRequest(
      `/api/admin/communities/${communityId}/noticeboard/${postId}`,
      body,
    ),
  deleteNoticeboardPost: (communityId: string, postId: string) =>
    deleteRequest(
      `/api/admin/communities/${communityId}/noticeboard/${postId}`,
    ),
};

import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const HijriEvents_APIS = {
  getAllEvents: () => getRequest("/api/admin/hijri-events"),
  getEvent: (id: string) => getRequest(`/api/admin/hijri-events/${id}`),
  createEvent: (body: FormData) =>
    postRequest("/api/admin/hijri-events", body),
  updateEvent: (id: string, body: FormData) =>
    putRequest(`/api/admin/hijri-events/${id}`, body),
  reorderEvents: (body: { eventIds: string[] }) =>
    patchRequest("/api/admin/hijri-events/reorder", body),
  deleteEvent: (id: string) => deleteRequest(`/api/admin/hijri-events/${id}`),
};

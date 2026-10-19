import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../utils/helpers/common/http-methods";
import type { SendNotificationPayload } from "../../utils/helpers/models/notifications/notification.dto";

export const Notifications_APIS = {
  list: (page = 1, limit = 10) =>
    getRequest("/api/admin/notifications", { page, limit }),
  send: (body: SendNotificationPayload) =>
    postRequest("/api/admin/notifications/bulk", body),
  remove: (id: string) => deleteRequest(`/api/admin/notifications/${id}`),
};

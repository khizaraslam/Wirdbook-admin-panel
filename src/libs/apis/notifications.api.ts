import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../utils/helpers/common/http-methods";
import type { SendNotificationPayload } from "../../utils/helpers/models/notifications/notification.dto";

export type CampaignScheduleKind = "weekly" | "lunar_days" | "hijri";

export interface NotificationCampaignPayload {
  name: string;
  title: string;
  body: string;
  scheduleKind: CampaignScheduleKind;
  daysOfWeek?: number[];
  hijriDays?: number[];
  hijriMonth?: number;
  hijriDay?: number;
  sendTime: string;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  title: string;
  body: string;
  status: "active" | "paused";
  scheduleKind: CampaignScheduleKind;
  daysOfWeek: number[] | null;
  hijriDays: number[] | null;
  hijriMonth: number | null;
  hijriDay: number | null;
  sendTime: string;
  timezone: string;
  scheduleLabel: string;
  createdAt: string;
}

export const Notifications_APIS = {
  list: (page = 1, limit = 10) =>
    getRequest("/api/admin/notifications", { page, limit }),
  send: (body: SendNotificationPayload) =>
    postRequest("/api/admin/notifications/bulk", body),
  remove: (id: string) => deleteRequest(`/api/admin/notifications/${id}`),
  listCampaigns: () => getRequest("/api/admin/notifications/campaigns"),
  createCampaign: (body: NotificationCampaignPayload) =>
    postRequest("/api/admin/notifications/campaigns", body),
  pauseCampaign: (id: string) =>
    postRequest(`/api/admin/notifications/campaigns/${id}/pause`, {}),
  resumeCampaign: (id: string) =>
    postRequest(`/api/admin/notifications/campaigns/${id}/resume`, {}),
  removeCampaign: (id: string) =>
    deleteRequest(`/api/admin/notifications/campaigns/${id}`),
};

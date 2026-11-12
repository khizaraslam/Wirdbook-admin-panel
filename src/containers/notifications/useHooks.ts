import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import {
  Notifications_APIS,
  type NotificationCampaign,
  type NotificationCampaignPayload,
} from "@/libs/apis/notifications.api";
import type {
  AdminNotificationDTO,
  SendNotificationPayload,
} from "@/utils/helpers/models/notifications/notification.dto";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const emptyMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const useNotifications = () => {
  const list = async (page = 1, limit = 10) => {
    const response = await Notifications_APIS.list(page, limit);
    const { success = false, data = [], pagination = emptyMeta } =
      response || {};
    if (!success) {
      return { items: [] as AdminNotificationDTO[], pagination: emptyMeta };
    }
    return {
      items: (data || []) as AdminNotificationDTO[],
      pagination: pagination as PaginationMeta,
    };
  };

  const send = async (payload: SendNotificationPayload) => {
    const response = await Notifications_APIS.send(payload);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Notification dispatched.");
      return true;
    }
    errorToaster(message || "Failed to send notification");
    return false;
  };

  const remove = async (id: string) => {
    const response = await Notifications_APIS.remove(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Notification removed.");
      return true;
    }
    errorToaster(message || "Failed to remove notification");
    return false;
  };

  const listCampaigns = async () => {
    const response = await Notifications_APIS.listCampaigns();
    const { success = false, data = [] } = response || {};
    if (!success) return [] as NotificationCampaign[];
    return (data || []) as NotificationCampaign[];
  };

  const createCampaign = async (payload: NotificationCampaignPayload) => {
    const response = await Notifications_APIS.createCampaign(payload);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Campaign created.");
      return true;
    }
    errorToaster(message || "Failed to create campaign");
    return false;
  };

  const pauseCampaign = async (id: string) => {
    const response = await Notifications_APIS.pauseCampaign(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Campaign paused.");
      return true;
    }
    errorToaster(message || "Failed to pause campaign");
    return false;
  };

  const resumeCampaign = async (id: string) => {
    const response = await Notifications_APIS.resumeCampaign(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Campaign resumed.");
      return true;
    }
    errorToaster(message || "Failed to resume campaign");
    return false;
  };

  const removeCampaign = async (id: string) => {
    const response = await Notifications_APIS.removeCampaign(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Campaign deleted.");
      return true;
    }
    errorToaster(message || "Failed to delete campaign");
    return false;
  };

  return {
    list,
    send,
    remove,
    listCampaigns,
    createCampaign,
    pauseCampaign,
    resumeCampaign,
    removeCampaign,
  };
};

export default useNotifications;

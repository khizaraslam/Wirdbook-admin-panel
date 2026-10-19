import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Notifications_APIS } from "@/libs/apis/notifications.api";
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

  return { list, send, remove };
};

export default useNotifications;

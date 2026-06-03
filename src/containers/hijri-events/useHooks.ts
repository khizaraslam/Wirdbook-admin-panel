import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { HijriEvents_APIS } from "@/libs/apis/hijri-events.api";
import type {
  HijriEventDTO,
} from "@/utils/helpers/models/hijri-events/hijri-event.dto";

const useHijriEvents = () => {
  const getAllEvents = async (setData: (data: HijriEventDTO[]) => void) => {
    const response = await HijriEvents_APIS.getAllEvents();
    const { success = false, data = null } = response || {};
    if (success) {
      setData(data || []);
    }
  };

  const addEvent = async (body: FormData) => {
    const response = await HijriEvents_APIS.createEvent(body);
    const { success = false } = response || {};
    if (success) {
      successToaster("Hijri event added successfully");
    }
  };

  const updateEvent = async (id: string, body: FormData) => {
    const response = await HijriEvents_APIS.updateEvent(id, body);
    const { success = false } = response || {};
    if (success) {
      successToaster("Hijri event updated successfully");
    } else {
      errorToaster("Failed to update Hijri event");
    }
  };

  const reorderEvents = async (eventIds: string[]) => {
    const response = await HijriEvents_APIS.reorderEvents({ eventIds });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Events reordered successfully");
    } else {
      errorToaster(message || "Failed to reorder events");
    }
  };

  const deleteEvent = async (
    id: string,
    setData: (data: HijriEventDTO[]) => void,
    currentData: HijriEventDTO[],
  ) => {
    const response = await HijriEvents_APIS.deleteEvent(id);
    const { success = false } = response || {};
    if (success) {
      successToaster("Hijri event deleted successfully");
      setData(currentData.filter((e) => String(e.id) !== String(id)));
    }
  };

  return {
    getAllEvents,
    addEvent,
    updateEvent,
    reorderEvents,
    deleteEvent,
  };
};

export default useHijriEvents;

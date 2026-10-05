import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Lectures_APIS } from "@/libs/apis/lectures.api";
import { LecturesDTO } from "@/utils/helpers/models/lectures/lectures.dto";

const useLectures = () => {
  const getAllLectures = useCallback(
    async (
      setData: Function,
      queryParams: Record<string, string | number> = {},
      setTotalElements?: Function,
    ) => {
      const response = await Lectures_APIS.getAllLectures(queryParams);
      const { success = false, data = null, pagination = null } = response || {};

      if (!success) return;

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      const total =
        pagination?.total ??
        (data && typeof data === "object" && "total" in data
          ? Number(data.total)
          : items.length);

      const mapped = items.map((item) => new LecturesDTO(item));
      const sorted = [...mapped].sort((a, b) => {
        const orderA = Number(a?.order ?? 0);
        const orderB = Number(b?.order ?? 0);
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a?.dateTime ? new Date(a.dateTime).getTime() : 0;
        const timeB = b?.dateTime ? new Date(b.dateTime).getTime() : 0;
        return timeB - timeA;
      });

      setData(sorted);
      setTotalElements?.(total);
    },
    [],
  );

  const addLecture = useCallback(async (body: FormData) => {
    const response = await Lectures_APIS.addLecture(body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture added successfully");
      return true;
    }
    errorToaster(message || "Failed to add lecture");
    return false;
  }, []);

  const updateLecture = useCallback(async (id: string, body: FormData) => {
    const response = await Lectures_APIS.updateLecture(id, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture updated successfully");
      return true;
    }
    errorToaster(message || "Failed to update lecture");
    return false;
  }, []);

  const deleteLecture = useCallback(async (id: string) => {
    const response = await Lectures_APIS.deleteLecture(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete lecture");
    return false;
  }, []);

  const assignTab = useCallback(async (id: string, tabId: string) => {
    const response = await Lectures_APIS.assignTab(id, { tabId });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture moved successfully");
      return true;
    }
    errorToaster(message || "Failed to move lecture");
    return false;
  }, []);

  const bulkAssignTabs = useCallback(
    async (lectureIds: string[], tabId: string) => {
      const response = await Lectures_APIS.bulkAssignTabs({ lectureIds, tabId });
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Lectures moved successfully");
        return true;
      }
      errorToaster(message || "Failed to move lectures");
      return false;
    },
    [],
  );

  return {
    getAllLectures,
    addLecture,
    updateLecture,
    deleteLecture,
    assignTab,
    bulkAssignTabs,
  };
};

export default useLectures;

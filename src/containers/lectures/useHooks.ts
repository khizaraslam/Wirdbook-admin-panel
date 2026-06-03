import { errorToaster, successToaster } from "@/utils/helpers/common/alert-service";
import { Lectures_APIS } from "@/libs/apis/lectures.api";
import { LecturesDTO } from "@/utils/helpers/models/lectures/lectures.dto";

const useLectures = () => {
  const getAllLectures = async (
    setData: Function,
    queryParams: any = {},
    setFilters?: Function,
    setTotalElements?: Function
  ) => {
    const response = await Lectures_APIS.getAllLectures(queryParams);
    const { success = false, data = null, pagination = null } = response || {};
    if (success && data && pagination) {
      const {
        page = 1,
        limit = 10,
        total = 0,
      } = pagination;

      setData(data);
      setFilters?.((prev: any) => ({
        ...prev,
        page: page,
        limit: limit,
      }));
      setTotalElements?.(total);
    }
  };

  const addLecture = async (body: FormData) => {
    const response = await Lectures_APIS.addLecture(body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture added successfully");
      return true;
    } else {
      errorToaster(message || "Failed to add lecture");
      return false;
    }
  };

  const updateLecture = async (id: string, body: FormData) => {
    const response = await Lectures_APIS.updateLecture(id, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture updated successfully");
      return true;
    } else {
      errorToaster(message || "Failed to update lecture");
      return false;
    }
  };

  const deleteLecture = async (id: string) => {
    const response = await Lectures_APIS.deleteLecture(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture deleted successfully");
      return true;
    } else {
      errorToaster(message || "Failed to delete lecture");
      return false;
    }
  };

  const assignTab = async (id: string, tabId: string) => {
    const response = await Lectures_APIS.assignTab(id, { tabId });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lecture moved successfully");
      return true;
    } else {
      errorToaster(message || "Failed to move lecture");
      return false;
    }
  };

  const bulkAssignTabs = async (lectureIds: string[], tabId: string) => {
    const response = await Lectures_APIS.bulkAssignTabs({ lectureIds, tabId });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Lectures moved successfully");
      return true;
    } else {
      errorToaster(message || "Failed to move lectures");
      return false;
    }
  };

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

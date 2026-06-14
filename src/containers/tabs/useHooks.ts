import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Tabs_APIS } from "@/libs/apis/tabs.api";
import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

const useTabs = () => {
  const getAllTabs = async (
    setData: Function,
    type: ContentType = "english",
  ) => {
    const response = await Tabs_APIS.getAllTabs(type);
    const { success = false, data = null } = response || {};
    if (success) {
      const tabs = data || [];
      setData(tabs);
    }
  };

  const addTab = async (body: AddTabDTO) => {
    const response = await Tabs_APIS.addTab(body);
    const { success = false } = response || {};
    if (success) {
      successToaster("Tab added successfully");
    }
  };

  const updateTab = async (id: string, queryParams: any = {}) => {
    const response = await Tabs_APIS.updateTab(id, queryParams);
    const { success = false } = response || {};

    if (success) {
      successToaster("Tab updated successfully");
    } else {
      errorToaster("Failed to update tab");
    }
  };

  const reorderTabs = async (type: ContentType, tabIds: string[]) => {
    const response = await Tabs_APIS.reorderTabs(type, { tabIds });
    const { success = false, message = "" } = response || {};

    if (success) {
      successToaster(message || "Tabs reordered successfully");
    } else {
      errorToaster(message || "Failed to reorder tabs");
    }
  };

  const deleteTab = async (
    id: string,
    setData: (data: TabsDTO[]) => void,
    currentData: TabsDTO[],
  ) => {
    const response = await Tabs_APIS.deleteTab(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Tab deleted successfully");
      const updatedTabs = currentData.filter(
        (tab) => String(tab.id) !== String(id),
      );
      setData(updatedTabs);
    }
  };

  return {
    getAllTabs,
    addTab,
    updateTab,
    reorderTabs,
    deleteTab,
  };
};

export default useTabs;

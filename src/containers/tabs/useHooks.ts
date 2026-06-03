import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "@/hooks/useStore";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Tabs_APIS } from "@/libs/apis/tabs.api";
import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";

const useTabs = () => {
  const navigate = useNavigate();

  const getAllTabs = async (setData: Function) => {
    const response = await Tabs_APIS.getAllTabs();
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
    console.log(response);

    const { success = false } = response || {};

    if (success) {
      successToaster("Tab updated successfully");
    } else {
      errorToaster("Failed to update tab");
    }
  };

  const reorderTabs = async (tabIds: string[]) => {
    const response = await Tabs_APIS.reorderTabs({ tabIds });
    console.log(response);

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
    console.log(response)

    const { success = false, message = "" } = response || {};
    console.log(message)
    if (success) {
      successToaster(message || "Tab deleted successfully");
      // Remove deleted tab from state
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

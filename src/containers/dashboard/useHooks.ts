import { useState } from "react";
import { Dashboard_APIS } from "@/libs/apis/dashboard.api";
import { DashboardStatsDTO } from "@/utils/helpers/models/dashboard/dashboard-stats.dto";

const useDashboard = () => {
  const getDashboardStats = async (setData: (data: DashboardStatsDTO) => void) => {
    const response = await Dashboard_APIS.getDashboardStats();
    const { success = false, data = null } = response || {};
    if (success && data) {
      setData(new DashboardStatsDTO(data));
    }
  };

  return {
    getDashboardStats,
  };
};

export default useDashboard;

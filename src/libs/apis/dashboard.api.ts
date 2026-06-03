import { getRequest } from "@/utils/helpers/common/http-methods";

export const Dashboard_APIS = {
  getDashboardStats: () => getRequest("/api/admin/dashboard"),
};

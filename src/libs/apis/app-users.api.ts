import { getRequest } from "../../utils/helpers/common/http-methods";

export interface AppUserOption {
  id: string;
  name: string;
  phone: string | null;
}

export const AppUsers_APIS = {
  list: (search?: string) =>
    getRequest("/api/admin/app-users", search ? { search } : {}),
};

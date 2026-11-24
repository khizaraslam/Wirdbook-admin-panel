import { createContext, useContext } from "react";
import type { AdminAction } from "./admin-access";

export const AdminActionContext = createContext<readonly AdminAction[]>([]);

export function useAdminAction(action: AdminAction): boolean {
  return useContext(AdminActionContext).includes(action);
}

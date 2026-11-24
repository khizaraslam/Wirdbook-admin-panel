import { useContext, type ReactNode } from "react";
import { AdminActionContext } from "@/utils/helpers/admin-action-context";
import type { AdminAction as Action } from "@/utils/helpers/admin-access";

export default function AdminAction({
  action,
  children,
  fallback = null,
}: {
  action: Action | Action[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const granted = useContext(AdminActionContext);
  const actions = Array.isArray(action) ? action : [action];
  return actions.some((item) => granted.includes(item)) ? children : fallback;
}

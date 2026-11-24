import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/utils/helpers/common/http-methods";
import type { AdminAction, AdminProfile } from "@/utils/helpers/admin-access";

export interface AdminModuleOption {
  key: string;
  label: string;
  actions: AdminAction[];
}

interface AccountsResult {
  accounts: AdminProfile[];
  modules: AdminModuleOption[];
}

interface ApiResult<T> {
  success?: boolean;
  data?: T;
  statusCode?: number;
  message?: string;
  error?: string;
  errors?: { message?: string }[];
}

export class AdminAccessApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

async function read<T>(
  request: Promise<ApiResult<T>>,
  fallback: string,
): Promise<T> {
  const result = await request;
  if (!result?.success || result.data === undefined) {
    throw new AdminAccessApiError(
      result?.errors?.[0]?.message ||
        result?.message ||
        result?.error ||
        fallback,
      result?.statusCode,
    );
  }
  return result.data;
}

const endpoint = "/api/admin/accounts";

export const AdminAccessApi = {
  me: () =>
    read<AdminProfile>(
      getRequest("/api/admin/me"),
      "Could not load admin access.",
    ),
  list: () =>
    read<AccountsResult>(
      getRequest(endpoint),
      "Could not load admin accounts.",
    ),
  create: (body: { email: string; password: string; permissions: string[] }) =>
    read<AdminProfile>(
      postRequest(endpoint, body),
      "Could not create the account.",
    ),
  remove: (id: string) =>
    read<null>(
      deleteRequest(`${endpoint}/${id}`),
      "Could not delete the account.",
    ),
  update: (
    id: string,
    body: { permissions?: string[]; enabled?: boolean; password?: string },
  ) =>
    read<AdminProfile>(
      patchRequest(`${endpoint}/${id}`, body),
      "Could not update admin access.",
    ),
};

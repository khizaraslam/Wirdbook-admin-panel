import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/helpers/common/http-methods";

export const DhikrTypes_APIS = {
  getAll: () => getRequest("/api/admin/dhikr/types"),
  create: (body: {
    name: string;
    nameAr: string;
    description?: string;
    sortOrder?: number;
  }) => postRequest("/api/admin/dhikr/types", body),
  update: (
    id: string,
    body: Partial<{
      name: string;
      nameAr: string;
      description: string | null;
      status: "active" | "inactive";
      sortOrder: number;
    }>,
  ) => patchRequest(`/api/admin/dhikr/types/${id}`, body),
};

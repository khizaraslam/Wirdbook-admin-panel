import axios from "../../utils/helpers/common/axios.config";
import {
  deleteRequest,
  getRequest,
  patchRequest,
} from "../../utils/helpers/common/http-methods";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const filenameFromDisposition = (header: string | undefined, fallback: string) => {
  if (!header) return fallback;
  const utfMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const match = header.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
};

export const SyncModules_APIS = {
  getAllModules: () => getRequest("/api/sync/modules"),
  updateModuleTime: (id: string, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      return patchRequest(`/api/admin/sync/modules/${id}/time`, formData);
    }
    return patchRequest(`/api/admin/sync/modules/${id}/time`, {});
  },
  deleteModule: (id: string) => deleteRequest(`/api/admin/sync/modules/${id}`),
  downloadModule: async (idOrName: string, fallbackName: string) => {
    const response = await axios.get(
      `/api/admin/sync/modules/${idOrName}/download`,
      {
        responseType: "blob",
        headers: getAuthHeaders(),
      },
    );
    const filename = filenameFromDisposition(
      response.headers["content-disposition"],
      `${fallbackName}.json`,
    );
    return { blob: response.data as Blob, filename };
  },
};


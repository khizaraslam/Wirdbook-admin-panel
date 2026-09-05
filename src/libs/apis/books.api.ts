import {
  getRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const Books_APIS = {
  list: () => getRequest("/api/admin/books"),
  create: (file: File, filename?: string) => {
    const form = new FormData();
    form.append("file", file);
    if (filename) form.append("filename", filename);
    return postRequest("/api/admin/books", form);
  },
  update: (filename: string, file: File) => {
    const form = new FormData();
    form.append("filename", filename);
    form.append("file", file);
    return putRequest("/api/admin/books", form);
  },
};

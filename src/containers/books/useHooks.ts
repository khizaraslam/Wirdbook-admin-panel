import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Books_APIS } from "@/libs/apis/books.api";
import type {
  BookDTO,
  BookUploadResponse,
} from "@/utils/helpers/models/books/book.dto";

const useBooks = () => {
  const getAll = useCallback(async (): Promise<BookDTO[]> => {
    const response = await Books_APIS.list();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) return data as BookDTO[];
    return [];
  }, []);

  const create = useCallback(async (file: File, filename?: string) => {
    const response = await Books_APIS.create(file, filename);
    const { success = false, message = "", data = null } = response || {};
    if (success) {
      const payload = (data || {}) as BookUploadResponse;
      successToaster(
        payload.replaced
          ? message || "Book replaced successfully"
          : message || "Book added successfully",
      );
      return true;
    }
    errorToaster(message || response?.error || "Failed to add book");
    return false;
  }, []);

  const update = useCallback(async (filename: string, file: File) => {
    const response = await Books_APIS.update(filename, file);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Book updated successfully");
      return true;
    }
    errorToaster(message || response?.error || "Failed to update book");
    return false;
  }, []);

  return { getAll, create, update };
};

export default useBooks;

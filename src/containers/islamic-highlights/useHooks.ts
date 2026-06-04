import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { IslamicHighlights_APIS } from "@/libs/apis/islamic-highlights.api";
import {
  IslamicHighlightDTO,
  normalizeIslamicHighlight,
} from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";

const useIslamicHighlights = () => {
  const getAllHighlights = useCallback(
    async (setData: (data: IslamicHighlightDTO[]) => void) => {
      const response = await IslamicHighlights_APIS.getAll();
      const { success = false, data = null } = response || {};
      if (success && Array.isArray(data)) {
        setData(
          data.map((item) =>
            normalizeIslamicHighlight(item as Partial<IslamicHighlightDTO>),
          ),
        );
      } else {
        setData([]);
      }
    },
    [],
  );

  const createHighlight = useCallback(async (body: FormData) => {
    const response = await IslamicHighlights_APIS.create(body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Islamic Highlight created successfully");
      return true;
    }
    errorToaster(message || "Failed to create highlight");
    return false;
  }, []);

  const updateHighlight = useCallback(
    async (id: string, body: FormData, method: "put" | "patch" = "put") => {
      const response =
        method === "patch"
          ? await IslamicHighlights_APIS.partialUpdate(id, body)
          : await IslamicHighlights_APIS.update(id, body);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Islamic Highlight updated successfully");
        return true;
      }
      errorToaster(message || "Failed to update highlight");
      return false;
    },
    [],
  );

  const reorderHighlights = useCallback(async (highlightIds: string[]) => {
    const response = await IslamicHighlights_APIS.reorder({ highlightIds });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Highlights reordered successfully");
      return true;
    }
    errorToaster(message || "Failed to reorder highlights");
    return false;
  }, []);

  const deleteHighlight = useCallback(
    async (
      id: string,
      setData: (data: IslamicHighlightDTO[]) => void,
      currentData: IslamicHighlightDTO[],
    ) => {
      const response = await IslamicHighlights_APIS.delete(id);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Islamic Highlight deleted successfully");
        setData(currentData.filter((h) => String(h.id) !== String(id)));
        return true;
      }
      errorToaster(message || "Failed to delete highlight");
      return false;
    },
    [],
  );

  return {
    getAllHighlights,
    createHighlight,
    updateHighlight,
    reorderHighlights,
    deleteHighlight,
  };
};

export default useIslamicHighlights;

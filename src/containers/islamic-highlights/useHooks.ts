import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { IslamicHighlights_APIS } from "@/libs/apis/islamic-highlights.api";
import { CreateIslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/create-islamic-highlight-tag.dto";
import {
  IslamicHighlightDTO,
  normalizeIslamicHighlight,
} from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";
import { IslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight-tag.dto";
import {
  type HighlightTagFieldError,
  type HighlightTagMutationResult,
} from "@/utils/helpers/islamic-highlights/helpers";

const parseTagFieldErrors = (
  errors: HighlightTagFieldError[] | undefined,
): Record<string, string> | undefined => {
  if (!Array.isArray(errors)) return undefined;
  const mapped: Record<string, string> = {};
  for (const err of errors) {
    if (err.field) mapped[err.field] = err.message;
  }
  return Object.keys(mapped).length > 0 ? mapped : undefined;
};

const handleTagMutationResponse = (
  response: {
    success?: boolean;
    message?: string;
    error?: string;
    statusCode?: number;
    errors?: HighlightTagFieldError[];
    data?: Partial<IslamicHighlightTagDTO> | null;
  } | null,
  fallbackError: string,
  successMessage: string,
): HighlightTagMutationResult => {
  if (response?.success) {
    successToaster(response.message || successMessage);
    return {
      success: true,
      tag: response.data ? new IslamicHighlightTagDTO(response.data) : undefined,
    };
  }

  const fieldErrors = parseTagFieldErrors(response?.errors);
  if (fieldErrors) {
    return { success: false, fieldErrors };
  }

  if (response?.statusCode === 409) {
    return {
      success: false,
      fieldErrors: { slug: "This slug name already exists" },
    };
  }

  const message = response?.message || response?.error || fallbackError;
  errorToaster(message);
  return { success: false, message };
};

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

  const getAllTags = useCallback(
    async (setData: (tags: IslamicHighlightTagDTO[]) => void) => {
      const response = await IslamicHighlights_APIS.getTags();
      const { success = false, data = null } = response || {};
      if (success && Array.isArray(data)) {
        const mapped = data.map((tag) => new IslamicHighlightTagDTO(tag));
        setData(mapped);
        return mapped;
      }
      setData([]);
      return [] as IslamicHighlightTagDTO[];
    },
    [],
  );

  const createTag = useCallback(async (body: CreateIslamicHighlightTagDTO) => {
    const response = await IslamicHighlights_APIS.createTag(body);
    return handleTagMutationResponse(
      response,
      "Failed to create tag",
      "Tag created successfully",
    );
  }, []);

  const updateTag = useCallback(
    async (id: string, body: CreateIslamicHighlightTagDTO) => {
      const response = await IslamicHighlights_APIS.updateTag(id, body);
      return handleTagMutationResponse(
        response,
        "Failed to update tag",
        "Tag updated successfully",
      );
    },
    [],
  );

  const deleteTag = useCallback(async (id: string) => {
    const response = await IslamicHighlights_APIS.deleteTag(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Tag deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete tag");
    return false;
  }, []);

  return {
    getAllHighlights,
    createHighlight,
    updateHighlight,
    reorderHighlights,
    deleteHighlight,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
  };
};

export default useIslamicHighlights;

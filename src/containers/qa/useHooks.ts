import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Qa_APIS } from "@/libs/apis/qa.api";
import { CreateQaItemDTO } from "@/utils/helpers/models/qa/create-qa-item.dto";
import { CreateQaTagDTO } from "@/utils/helpers/models/qa/create-qa-tag.dto";
import { QaFiltersDTO } from "@/utils/helpers/models/qa/qa-filters.dto";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { UpdateQaItemDTO } from "@/utils/helpers/models/qa/update-qa-item.dto";
import {
  type QaFieldError,
  type QaTagMutationResult,
} from "@/utils/helpers/qa/helpers";

const parseTagFieldErrors = (
  errors: QaFieldError[] | undefined,
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
    errors?: QaFieldError[];
    data?: Partial<QaTagDTO> | null;
  } | null,
  fallbackError: string,
  successMessage: string,
): QaTagMutationResult => {
  if (response?.success) {
    successToaster(response.message || successMessage);
    return {
      success: true,
      tag: response.data ? new QaTagDTO(response.data) : undefined,
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

const buildListParams = (filters: QaFiltersDTO) => {
  const params: Record<string, string | number | boolean> = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
    includeUnpublished: filters.includeUnpublished,
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.tagId) params.tagId = filters.tagId;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  if (filters.source && filters.source !== "all") params.source = filters.source;
  if (filters.visibility && filters.visibility !== "all") {
    params.visibility = filters.visibility;
  }
  return params;
};

const useQa = () => {
  const getAllItems = useCallback(
    async (
      setData: (items: QaItemDTO[]) => void,
      filters: QaFiltersDTO,
      setFilters?: (fn: (prev: QaFiltersDTO) => QaFiltersDTO) => void,
      setTotalElements?: (total: number) => void,
    ) => {
      const response = await Qa_APIS.getItems(buildListParams(filters));
      const { success = false, data = null, pagination = null } =
        response || {};

      if (success && Array.isArray(data)) {
        setData(data.map((item) => new QaItemDTO(item)));
        if (pagination) {
          const { page = 1, limit = 10, total = 0 } = pagination;
          setFilters?.((prev) => {
            if (prev.page === page && prev.limit === limit) return prev;
            return { ...prev, page, limit };
          });
          setTotalElements?.(total);
        } else {
          setTotalElements?.(data.length);
        }
      } else {
        setData([]);
        setTotalElements?.(0);
      }
    },
    [],
  );

  const getItem = useCallback(async (id: string): Promise<QaItemDTO | null> => {
    const response = await Qa_APIS.getItem(id);
    const { success = false, data = null } = response || {};
    if (success && data) return new QaItemDTO(data);
    return null;
  }, []);

  const createItem = useCallback(async (body: CreateQaItemDTO) => {
    const response = await Qa_APIS.createItem(body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item created successfully");
      return true;
    }
    errorToaster(message || "Failed to create Q&A item");
    return false;
  }, []);

  const updateItem = useCallback(async (id: string, body: UpdateQaItemDTO) => {
    const response = await Qa_APIS.updateItem(id, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item updated successfully");
      return true;
    }
    errorToaster(message || "Failed to update Q&A item");
    return false;
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const response = await Qa_APIS.deleteItem(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete Q&A item");
    return false;
  }, []);

  const publishItem = useCallback(async (id: string) => {
    const response = await Qa_APIS.publishItem(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item published");
      return true;
    }
    errorToaster(
      message || response?.error || "Failed to publish Q&A item",
    );
    return false;
  }, []);

  const unpublishItem = useCallback(async (id: string) => {
    const response = await Qa_APIS.unpublishItem(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item unpublished");
      return true;
    }
    errorToaster(message || "Failed to unpublish Q&A item");
    return false;
  }, []);

  const rejectItem = useCallback(async (id: string) => {
    const response = await Qa_APIS.rejectItem(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Q&A item rejected");
      return true;
    }
    errorToaster(message || "Failed to reject Q&A item");
    return false;
  }, []);

  const getSubmittedCount = useCallback(async (): Promise<number> => {
    const response = await Qa_APIS.getItems({
      status: "submitted",
      page: 1,
      limit: 1,
      includeUnpublished: true,
    });
    return response?.pagination?.total ?? 0;
  }, []);

  const getAllTags = useCallback(async (setData: (tags: QaTagDTO[]) => void) => {
    const response = await Qa_APIS.getTags();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) {
      const mapped = data.map((tag) => new QaTagDTO(tag));
      setData(mapped);
      return mapped;
    }
    setData([]);
    return [] as QaTagDTO[];
  }, []);

  const createTag = useCallback(async (body: CreateQaTagDTO) => {
    const response = await Qa_APIS.createTag(body);
    return handleTagMutationResponse(
      response,
      "Failed to create tag",
      "Tag created successfully",
    );
  }, []);

  const updateTag = useCallback(async (id: string, body: CreateQaTagDTO) => {
    const response = await Qa_APIS.updateTag(id, body);
    return handleTagMutationResponse(
      response,
      "Failed to update tag",
      "Tag updated successfully",
    );
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    const response = await Qa_APIS.deleteTag(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Tag deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete tag");
    return false;
  }, []);

  return {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    unpublishItem,
    rejectItem,
    getSubmittedCount,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
  };
};

export default useQa;

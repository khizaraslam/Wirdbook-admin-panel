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
    errorToaster(message || "Failed to publish Q&A item");
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

  const getAllTags = useCallback(async (setData: (tags: QaTagDTO[]) => void) => {
    const response = await Qa_APIS.getTags();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) {
      setData(data.map((tag) => new QaTagDTO(tag)));
    } else {
      setData([]);
    }
  }, []);

  const createTag = useCallback(async (body: CreateQaTagDTO) => {
    const response = await Qa_APIS.createTag(body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Tag created successfully");
      return true;
    }
    errorToaster(message || "Failed to create tag");
    return false;
  }, []);

  const updateTag = useCallback(async (id: string, body: CreateQaTagDTO) => {
    const response = await Qa_APIS.updateTag(id, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Tag updated successfully");
      return true;
    }
    errorToaster(message || "Failed to update tag");
    return false;
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
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
  };
};

export default useQa;

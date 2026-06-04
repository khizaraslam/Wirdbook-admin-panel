import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Check,
  Tag,
  HelpCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { QaFiltersDTO, QaSortOption } from "@/utils/helpers/models/qa/qa-filters.dto";
import useQa from "./useHooks";
import QaItemsTable from "./components/QaItemsTable";
import AddQaItemModal from "./components/AddQaItemModal";
import EditQaItemModal from "./components/EditQaItemModal";
import ManageTagsModal from "./components/ManageTagsModal";
const Qa = () => {
  const {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    unpublishItem,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
  } = useQa();

  const [data, setData] = useState<QaItemDTO[]>([]);
  const [tags, setTags] = useState<QaTagDTO[]>([]);
  const [filters, setFilters] = useState<QaFiltersDTO>(new QaFiltersDTO());
  const [totalElements, setTotalElements] = useState(0);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QaItemDTO | null>(null);

  // Tags: load once when page opens (same pattern as Lectures → tabs)
  useEffect(() => {
    getAllTags(setTags);
  }, [getAllTags]);

  const debouncedSearch = useDebounce(filters.search, 1500);

  // Items: fetch when debounced search changes (initial mount included)
  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      setIsPageLoading(true);
      const next = new QaFiltersDTO({
        ...filtersRef.current,
        search: debouncedSearch,
        page: 1,
      });
      filtersRef.current = next;

      setFilters((prev) => {
        if (prev.search === next.search && prev.page === 1) return prev;
        return next;
      });

      await getAllItems(setData, next, setFilters, setTotalElements);

      if (!cancelled) {
        setIsPageLoading(false);
      }
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, getAllItems]);

  const applyFilters = (patch: Partial<QaFiltersDTO>) => {
    const next = new QaFiltersDTO({ ...filtersRef.current, ...patch, page: 1 });
    setFilters(next);
    getAllItems(setData, next, setFilters, setTotalElements);
  };

  const handlePageChange = (newPage: number) => {
    const next = new QaFiltersDTO({ ...filtersRef.current, page: newPage });
    setFilters(next);
    getAllItems(setData, next, setFilters, setTotalElements);
  };

  const handleSortChange = (sort: QaSortOption) => {
    applyFilters({ sort });
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Are you sure you want to delete this Q&A item?",
    );
    if (result.isConfirmed) {
      const ok = await deleteItem(id);
      if (ok)
        getAllItems(
          setData,
          filtersRef.current,
          setFilters,
          setTotalElements,
        );
    }
  };

  const handleTogglePublish = async (item: QaItemDTO) => {
    const ok = item.isPublished
      ? await unpublishItem(item.id)
      : await publishItem(item.id);
    if (ok)
      getAllItems(
        setData,
        filtersRef.current,
        setFilters,
        setTotalElements,
      );
  };

  const currentTagLabel = !filters.tagId
    ? "All tags"
    : tags.find((t) => t.id === filters.tagId)?.labelEn || "Selected tag";

  const maxOrder =
    data.length > 0 ? Math.max(...data.map((i) => i.indexOrder)) + 1 : 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary">Q&A Management</h1>
          <p className="text-muted mt-2">
            Manage bilingual questions and answers (English & Arabic) for the app
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<Tag size={18} />}
            className="rounded-md px-4 py-2.5"
            onClick={() => setIsTagsModalOpen(true)}
          >
            Manage Tags
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            className="rounded-md px-5 py-2.5 btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Q&A
          </Button>
        </div>
      </div>

      <div className="bg-primary-light rounded-2xl p-6 mt-8 shadow-sm">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <HelpCircle size={18} className="text-primary" />
          <span>
            {isPageLoading
              ? "Loading Q&A..."
              : `${totalElements} total items • Search, filter by tag or date, sort by date or alphabetically`}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-2">
              Filter by tag
            </label>
            <div
              onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
              className={`relative flex items-center w-full bg-gray-50 border rounded-lg px-4 py-3 cursor-pointer ${
                isTagFilterOpen
                  ? "border-primary bg-white shadow-md"
                  : "border-gray-100"
              }`}
            >
              <Filter size={18} className="absolute left-4 text-gray-400" />
              <span className="flex-1 text-sm font-medium text-gray-700 pl-8 pr-6 truncate text-center">
                {currentTagLabel}
              </span>
              <ChevronDown
                size={18}
                className={`absolute right-4 transition-transform ${
                  isTagFilterOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {isTagFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsTagFilterOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-2xl p-2 z-20 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      applyFilters({ tagId: null });
                      setIsTagFilterOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
                      !filters.tagId
                        ? "bg-primary/5 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>All tags</span>
                    {!filters.tagId && <Check size={16} />}
                  </div>
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => {
                        applyFilters({ tagId: tag.id });
                        setIsTagFilterOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
                        filters.tagId === tag.id
                          ? "bg-primary/5 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>
                        {tag.labelEn}
                        {tag.labelAr ? ` (${tag.labelAr})` : ""}
                      </span>
                      {filters.tagId === tag.id && <Check size={16} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-2">
              Search
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                placeholder="Search questions or answers..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-2">
              Sort
            </label>
            <select
              value={filters.sort}
              onChange={(e) =>
                handleSortChange(e.target.value as QaSortOption)
              }
              className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-primary"
            >
              <option value="date">Date (newest first)</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-2">
                From
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, from: e.target.value }))
                }
                onBlur={(e) =>
                  applyFilters({ from: e.target.value })
                }
                className="w-full py-3 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block mb-2">
                To
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, to: e.target.value }))
                }
                onBlur={(e) => applyFilters({ to: e.target.value })}
                className="w-full py-3 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={filters.includeUnpublished}
              onChange={(e) =>
                applyFilters({ includeUnpublished: e.target.checked })
              }
              className="rounded border-gray-300 text-primary"
            />
            Include unpublished (drafts)
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const cleared = new QaFiltersDTO();
              setFilters(cleared);
              getAllItems(setData, cleared, setFilters, setTotalElements);
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      {isPageLoading ? (
        <div className="flex justify-center items-center py-20 text-muted font-medium">
          Loading Q&A items...
        </div>
      ) : (
      <QaItemsTable
        items={data}
        totalElements={totalElements}
        onEdit={setEditingItem}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />
      )}

      {!isPageLoading && (
      <Pagination
        meta={{
          page: filters.page,
          limit: filters.limit,
          total: totalElements,
          totalPages: Math.ceil(totalElements / filters.limit) || 1,
          hasNext:
            filters.page <
            Math.ceil(totalElements / filters.limit),
          hasPrev: filters.page > 1,
        }}
        onPageChange={handlePageChange}
      />
      )}

      <AddQaItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (body) => {
          const ok = await createItem(body);
          if (ok) {
            const cleared = new QaFiltersDTO();
            setFilters(cleared);
            getAllItems(setData, cleared, setFilters, setTotalElements);
          }
          return ok;
        }}
        tags={tags}
        defaultIndexOrder={maxOrder}
      />

      <EditQaItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={async (id, body) => {
          const ok = await updateItem(id, body);
          if (ok)
            getAllItems(
              setData,
              filtersRef.current,
              setFilters,
              setTotalElements,
            );
          return ok;
        }}
        tags={tags}
      />

      <ManageTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        tags={tags}
        onRefresh={() => getAllTags(setTags)}
        createTag={createTag}
        updateTag={updateTag}
        deleteTag={deleteTag}
      />
    </div>
  );
};

export default Qa;

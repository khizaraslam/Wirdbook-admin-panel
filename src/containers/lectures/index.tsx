import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Filter, ChevronDown, Check, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LecturesTable from "./components/LecturesTable";
import AddLectureModal from "./components/AddLectureModal";
import EditLectureModal from "./components/EditLectureModal";
import { LecturesDTO } from "@/utils/helpers/models/lectures/lectures.dto";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import useLectures from "./useHooks";
import useTabs from "../tabs/useHooks";
import { LectureFiltersDTO } from "@/utils/helpers/models/lectures/lecture-filters.dto";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";

const Lectures = () => {
  const [data, setData] = useState<LecturesDTO[]>([]);
  const [tabs, setTabs] = useState<TabsDTO[]>([]);
  const [filters, setFilters] = useState<LectureFiltersDTO>(
    new LectureFiltersDTO(),
  );
  const [totalElements, setTotalElements] = useState<number>(0);

  const {
    getAllLectures,
    addLecture,
    updateLecture,
    deleteLecture,
    assignTab,
  } = useLectures();
  const { getAllTabs } = useTabs();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LecturesDTO | null>(
    null,
  );

  const getLectures = useCallback(
    (currentFilters: LectureFiltersDTO) => {
      const params: any = {
        page: currentFilters.page,
        limit: currentFilters.limit,
      };
      if (currentFilters.tabId) {
        params.tabId = currentFilters.tabId;
      }
      if (currentFilters.search) {
        params.search = currentFilters.search;
      }
      getAllLectures(setData, params, setFilters, setTotalElements);
    },
    [getAllLectures],
  );

  useEffect(() => {
    getAllTabs(setTabs);
  }, []);

  const debouncedSearch = useDebounce(filters.search, 1500);

  useEffect(() => {
    getLectures({ ...filters, search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    getLectures(updatedFilters);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await confirmationPopup(
        "Are you sure you want to delete this Lecture?",
      );
      if (result.isConfirmed) {
        const success = await deleteLecture(id);
        if (success) {
          getLectures(filters);
        }
      }
    },
    [deleteLecture, getLectures, filters],
  );

  const handleEdit = useCallback((lecture: LecturesDTO) => {
    setEditingLecture(lecture);
  }, []);

  const handleMoveToTab = async (id: string, tabId: string) => {
    const success = await assignTab(id, tabId);
    if (success) {
      getLectures(filters);
    }
  };

  const handleAddLecture = async (formData: FormData) => {
    const success = await addLecture(formData);
    if (success) {
      getLectures(new LectureFiltersDTO()); // Reset to first page
    }
  };

  const handleUpdateLecture = async (id: string, formData: FormData) => {
    const success = await updateLecture(id, formData);
    if (success) {
      getLectures(filters);
    }
  };

  const currentTabLabel = useMemo(() => {
    if (!filters.tabId) return "All Lectures";
    return tabs.find((t) => t.id === filters.tabId)?.label || "Unknown Tab";
  }, [filters.tabId, tabs]);

  return (
    <div className="">
      {/* Header Section */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            Lectures Management
          </h1>
          <p className="text-muted mt-2">Add and organize lecture content</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={20} />}
          className="rounded-md px-5 py-2.5 btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Lecture
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative mt-10">
        <div className="flex items-end gap-6">
          {/* Filter by Tab */}
          <div className="flex-1 relative">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              </div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block">
                Filter by Tab
              </label>
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative flex items-center w-full bg-gray-50 border rounded-lg px-4 py-3 cursor-pointer transition-all group ${isFilterOpen ? "border-primary bg-white shadow-md" : "border-gray-100 hover:bg-gray-100/50"}`}
              >
                <Filter
                  size={18}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${isFilterOpen ? "text-primary" : "text-gray-400"} group-hover:text-primary`}
                />
                <div className="flex-1 text-sm font-medium text-gray-700 pl-7 pr-6 truncate text-center">
                  {currentTabLabel}
                </div>
                <ChevronDown
                  size={18}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 ${isFilterOpen ? "rotate-180 text-primary" : ""}`}
                />
              </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in duration-200 origin-top">
                  <div
                    onClick={() => {
                      setFilters({ ...filters, tabId: null, page: 1 });
                      getLectures({ ...filters, tabId: null, page: 1 });
                      setIsFilterOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${!filters.tabId ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>All Lectures</span>
                    {!filters.tabId && <Check size={16} />}
                  </div>
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => {
                        setFilters({ ...filters, tabId: tab.id, page: 1 });
                        getLectures({ ...filters, tabId: tab.id, page: 1 });
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${filters.tabId === tab.id ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{tab.label}</span>
                      {filters.tabId === tab.id && <Check size={16} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search by Title */}
          <div className="flex-1 space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 block">
              Search by Title
            </label>
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                placeholder="Search lectures..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <LecturesTable
          lectures={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveToTab={handleMoveToTab}
          availableTabs={tabs}
          title={currentTabLabel}
          totalElements={totalElements}
        />

        <Pagination
          meta={{
            page: filters.page,
            limit: filters.limit,
            total: totalElements,
            totalPages: Math.ceil(totalElements / filters.limit),
            hasNext: filters.page < Math.ceil(totalElements / filters.limit),
            hasPrev: filters.page > 1,
          }}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <AddLectureModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLecture}
        tabs={tabs}
      />

      <EditLectureModal
        isOpen={!!editingLecture}
        lecture={editingLecture}
        onClose={() => setEditingLecture(null)}
        onSave={handleUpdateLecture}
        tabs={tabs}
      />
    </div>
  );
};

export default Lectures;

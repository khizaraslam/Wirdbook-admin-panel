import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import LanguageTypeSwitcher from "@/components/ui/LanguageTypeSwitcher";
import SortableTabItem from "./components/SortableTabItem";
import AddTabModal from "./components/AddTabModal";
import EditTabModal from "./components/EditTabModal";
import useTabs from "./useHooks";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import { UpdateTabDTO } from "@/utils/helpers/models/tabs/update-tab.dto";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

const Tabs = () => {
  const { getAllTabs, addTab, updateTab, reorderTabs, deleteTab } = useTabs();
  const { isLoading } = useStore();
  const [contentType, setContentType] = useState<ContentType>("english");
  const [data, setData] = useState<TabsDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<TabsDTO | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    getAllTabs(setData, contentType);
  }, [contentType]);

  const handleLanguageChange = (type: ContentType) => {
    setContentType(type);
    setEditingTab(null);
    setIsModalOpen(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(data, oldIndex, newIndex);
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        setData(updatedItems);

        const tabIds = updatedItems.map((item) => item.id);
        await reorderTabs(contentType, tabIds);
      }
    }
  };

  const handleAddTab = async (label: string, slug: string, order: number) => {
    const body = new AddTabDTO({ label, slug, order, type: contentType });
    await addTab(body);
    getAllTabs(setData, contentType);
  };

  const handleUpdateTab = async (
    id: string,
    label: string,
    slug: string,
    order: number,
  ) => {
    const body = new UpdateTabDTO({ label, slug, order, type: contentType });
    await updateTab(id, body);
    getAllTabs(setData, contentType);
  };

  const handleDeleteTab = async (id: string) => {
    const result = await confirmationPopup(
      "Are you sure you want to delete this Tab?",
    );

    if (result.isConfirmed) {
      await deleteTab(id, setData, data);
    }
  };

  const languageLabel = contentType === "english" ? "English" : "Arabic";

  return (
    <div className="">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Lecture Tabs</h1>
          <p className="text-muted mt-2">
            Manage {languageLabel.toLowerCase()} categories for organizing lectures
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <LanguageTypeSwitcher
            value={contentType}
            onChange={handleLanguageChange}
          />
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            className="rounded-md px-5 py-2.5 btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add {languageLabel} Tab
          </Button>
        </div>
      </div>

      <div className="bg-primary-light rounded-2xl p-8 mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
        <p className="text-muted mb-6">{languageLabel} tab configuration</p>
        <div className="flex items-center gap-2 text-gray-700 font-medium bg-white/50 w-fit px-4 py-2 rounded-lg border border-primary/10">
          <BookOpen size={18} className="text-primary" />
          <span>{data.length} {languageLabel.toLowerCase()} tabs • Drag to reorder</span>
        </div>
      </div>

      <div className="mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{languageLabel} Tabs</h2>
        <p className="text-muted">Drag and drop to change order</p>
      </div>

      {data.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={data} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {data.map((tab) => (
                <SortableTabItem
                  key={tab.id}
                  tab={tab}
                  onEdit={setEditingTab}
                  onDelete={handleDeleteTab}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title={`No ${languageLabel} Tabs Found`}
          slogan={`Create your first ${languageLabel.toLowerCase()} tab category to get started`}
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center"
        />
      )}

      <AddTabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTab}
        defaultOrder={data.length + 1}
        contentType={contentType}
      />
      <EditTabModal
        isOpen={!!editingTab}
        tab={editingTab}
        onClose={() => setEditingTab(null)}
        onSave={handleUpdateTab}
      />
    </div>
  );
};

export default Tabs;

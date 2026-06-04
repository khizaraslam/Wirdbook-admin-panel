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
import { Plus, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import SortableHighlightItem from "./components/SortableHighlightItem";
import AddHighlightModal from "./components/AddHighlightModal";
import EditHighlightModal from "./components/EditHighlightModal";
import HighlightPreviewModal from "./components/HighlightPreviewModal";
import useIslamicHighlights from "./useHooks";
import type { IslamicHighlightDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";

const IslamicHighlights = () => {
  const {
    getAllHighlights,
    createHighlight,
    updateHighlight,
    reorderHighlights,
    deleteHighlight,
  } = useIslamicHighlights();
  const { isLoading } = useStore();

  const [data, setData] = useState<IslamicHighlightDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IslamicHighlightDTO | null>(null);
  const [previewing, setPreviewing] = useState<IslamicHighlightDTO | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const refreshList = () => getAllHighlights(setData);

  useEffect(() => {
    refreshList();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((item) => item.id === active.id);
    const newIndex = data.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(data, oldIndex, newIndex).map((item, index) => ({
      ...item,
      indexOrder: index,
    }));
    setData(newItems);
    await reorderHighlights(newItems.map((i) => i.id));
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const formData = new FormData();
    formData.append("isEnabled", enabled ? "true" : "false");
    const ok = await updateHighlight(id, formData, "patch");
    if (ok) refreshList();
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Delete this Islamic Highlight? Linked media will be removed.",
    );
    if (result.isConfirmed) {
      await deleteHighlight(id, setData, data);
    }
  };

  const maxOrder =
    data.length > 0 ? Math.max(...data.map((h) => h.indexOrder)) + 1 : 0;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Islamic Highlights</h1>
          <p className="text-muted mt-2">
            Schedule verses, hadith, or wisdom with optional audio and images
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={20} />}
          className="rounded-md px-5 py-2.5 btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Highlight
        </Button>
      </div>

      <div className="bg-primary-light rounded-2xl p-8 mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
        <p className="text-muted mb-6">
          Click a highlight to preview message and play audio
        </p>
        <div className="flex items-center gap-2 text-gray-700 font-medium bg-white/50 w-fit px-4 py-2 rounded-lg border border-primary/10">
          <Sparkles size={18} className="text-primary" />
          <span>{data.length} highlights • Drag to reorder</span>
        </div>
      </div>

      <div className="mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Highlights</h2>
        <p className="text-muted">Drag and drop to change display order</p>
      </div>

      {data.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.map((item) => (
                <SortableHighlightItem
                  key={item.id}
                  highlight={item}
                  onPreview={setPreviewing}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  onToggleEnabled={handleToggleEnabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Highlights Found"
          slogan="Add your first scheduled message to get started"
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center"
        />
      )}

      <AddHighlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={async (formData) => {
          const ok = await createHighlight(formData);
          if (ok) refreshList();
          return ok;
        }}
        defaultOrder={maxOrder}
      />

      <EditHighlightModal
        isOpen={!!editing}
        highlight={editing}
        onClose={() => setEditing(null)}
        onSave={async (id, formData, method) => {
          const ok = await updateHighlight(id, formData, method);
          if (ok) refreshList();
          return ok;
        }}
      />

      <HighlightPreviewModal
        isOpen={!!previewing}
        highlight={previewing}
        onClose={() => setPreviewing(null)}
      />
    </div>
  );
};

export default IslamicHighlights;

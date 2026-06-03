import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, BookOpen, Edit2, Trash2 } from "lucide-react";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";

interface SortableTabItemProps {
  tab: TabsDTO;
  onEdit: (tab: TabsDTO) => void;
  onDelete: (id: string) => void;
}

const SortableTabItem: React.FC<SortableTabItemProps> = ({
  tab,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-primary/5 rounded-xl p-4 mb-3 flex items-center justify-between shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted p-1 hover:bg-primary-light rounded transition-colors"
        >
          <GripVertical size={20} />
        </div>

        {/* Tab Icon */}
        <div className="bg-primary text-white p-2.5 rounded-xl shadow-sm">
          <BookOpen size={20} />
        </div>

        {/* Tab Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{tab.label}</h3>
          <p className="text-sm text-muted">
            Slug: {tab.slug} • Order: {tab.order}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(tab)}
          className="p-2 hover:text-muted cursor-pointer text-primary hover:bg-primary-light border border-primary/10 rounded-lg transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(tab.id)}
          className="p-2 hover:text-red-600 cursor-pointer text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SortableTabItem;

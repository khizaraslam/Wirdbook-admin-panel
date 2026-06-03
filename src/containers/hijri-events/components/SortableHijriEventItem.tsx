import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, Edit2, Trash2, Star } from "lucide-react";
import type { HijriEventDTO } from "@/utils/helpers/models/hijri-events/hijri-event.dto";

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${imageUrl}`;
};

interface SortableHijriEventItemProps {
  event: HijriEventDTO;
  onEdit: (event: HijriEventDTO) => void;
  onDelete: (id: string) => void;
}

const SortableHijriEventItem: React.FC<SortableHijriEventItemProps> = ({
  event,
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
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };
  const fullIconUrl = event.icon ? getImageUrl(event.icon) : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-primary/5 rounded-xl p-4 mb-3 flex items-stretch justify-between gap-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted p-1 hover:bg-primary-light rounded transition-colors shrink-0"
        >
          <GripVertical size={20} />
        </div>

        {fullIconUrl ? (
          <img
            src={fullIconUrl}
            alt={event.name}
            className="w-10 h-10 object-cover rounded-xl border border-primary/10 shrink-0"
          />
        ) : (
          <div className="bg-primary text-white p-2.5 rounded-xl shadow-sm shrink-0">
            <Calendar size={20} />
          </div>
        )}

        <div className="min-w-0 flex-1 py-0.5 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {event.name}
            </h3>
            {event.isHighlighted && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                Highlighted
              </span>
            )}
          </div>
          <p
            className="text-sm text-muted truncate mt-1.5 pt-2 pb-0.5"
            dir="rtl"
            style={{ lineHeight: 2.2 }}
          >
            {event.arabicName || "—"}
          </p>
          <p className="text-sm text-muted mt-1">
            Hijri {event.hijriDay}/{event.hijriMonth} • Order: {event.indexOrder}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(event)}
          className="p-2 hover:text-muted cursor-pointer text-primary hover:bg-primary-light border border-primary/10 rounded-lg transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(event.id)}
          className="p-2 hover:text-red-600 cursor-pointer text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SortableHijriEventItem;

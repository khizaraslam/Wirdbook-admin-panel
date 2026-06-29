import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Music,
  ImageIcon,
} from "lucide-react";
import type { IslamicHighlightDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";
import {
  formatScheduleLabel,
  formatTimeSlotLabel,
  getMediaUrl,
} from "@/utils/helpers/islamic-highlights/helpers";

interface SortableHighlightItemProps {
  highlight: IslamicHighlightDTO;
  onPreview: (item: IslamicHighlightDTO) => void;
  onEdit: (item: IslamicHighlightDTO) => void;
  onDelete: (id: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

const SortableHighlightItem: React.FC<SortableHighlightItemProps> = ({
  highlight,
  onPreview,
  onEdit,
  onDelete,
  onToggleEnabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: highlight.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const thumbUrl = getMediaUrl(highlight.imageUrl);
  const typeLabel =
    highlight.messageType.charAt(0).toUpperCase() +
    highlight.messageType.slice(1);

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
          className="cursor-grab active:cursor-grabbing text-muted p-1 hover:bg-primary-light rounded"
        >
          <GripVertical size={20} />
        </div>

        <button
          type="button"
          onClick={() => onPreview(highlight)}
          className="w-16 h-16 rounded-xl overflow-hidden bg-primary-light flex-shrink-0 flex items-center justify-center hover:ring-2 hover:ring-primary/30 transition-all"
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Sparkles size={24} className="text-primary/50" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onPreview(highlight)}
          className="min-w-0 flex-1 py-0.5 text-left hover:opacity-90"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {highlight.message.en || highlight.message.ar || "—"}
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 shrink-0">
              {formatTimeSlotLabel(highlight.timeSlot)}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary shrink-0">
              {typeLabel}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
              {formatScheduleLabel(highlight.schedule)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1 ${
                highlight.enabled
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {highlight.enabled ? (
                <>
                  <Eye size={12} />
                  On
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Off
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-muted truncate mt-1" dir="rtl">
            {highlight.message.ar || "—"}
          </p>
          {(highlight.source.en || highlight.source.ar) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {highlight.source.en || highlight.source.ar}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span>Order: {highlight.indexOrder}</span>
            {highlight.audioUrl && (
              <span className="inline-flex items-center gap-1">
                <Music size={12} /> Audio
              </span>
            )}
            {highlight.imageUrl && (
              <span className="inline-flex items-center gap-1">
                <ImageIcon size={12} /> Image
              </span>
            )}
          </div>
        </button>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onToggleEnabled(highlight.id, !highlight.enabled)}
          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border ${
            highlight.enabled
              ? "border-amber-200 text-amber-800 hover:bg-amber-50"
              : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          }`}
        >
          {highlight.enabled ? "Disable" : "Enable"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(highlight)}
            className="p-2 text-primary hover:bg-primary-light border border-primary/10 rounded-lg"
          >
            <Edit2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(highlight.id)}
            className="p-2 text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableHighlightItem;

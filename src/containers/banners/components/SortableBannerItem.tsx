import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImageIcon, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { BannerDTO } from "@/utils/helpers/models/banners/banner.dto";

const getImageUrl = (image: string | null) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${image}`;
};

interface SortableBannerItemProps {
  banner: BannerDTO;
  onEdit: (banner: BannerDTO) => void;
  onDelete: (id: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

const SortableBannerItem: React.FC<SortableBannerItemProps> = ({
  banner,
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
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const fullImageUrl = getImageUrl(banner.image);
  const isBanner = banner.type === "banner";
  const isText = banner.type === "text";
  const hasSurah =
    isText &&
    !!(banner.surah_name?.en_text ||
      banner.surah_name?.ar_text ||
      banner.surah_reference?.en_text ||
      banner.surah_reference?.ar_text);
  const surahLine = hasSurah
    ? [
        banner.surah_name?.en_text || banner.surah_name?.ar_text,
        banner.surah_reference?.en_text || banner.surah_reference?.ar_text,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

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
          className="cursor-grab active:cursor-grabbing text-muted p-1 hover:bg-primary-light rounded transition-colors"
        >
          <GripVertical size={20} />
        </div>

        <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-light flex-shrink-0 flex items-center justify-center">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={banner.title?.en_text || banner.title?.ar_text || "Banner"}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={24} className="text-primary/50" />
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {banner.title?.en_text || banner.title?.ar_text || "—"}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${
                isBanner
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {isBanner ? "Banner" : "Text"}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1 ${
                banner.enabled
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-900 border border-amber-200"
              }`}
            >
              {banner.enabled ? (
                <>
                  <Eye size={12} />
                  Public
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Hidden
                </>
              )}
            </span>
          </div>
          <div className="mt-1.5 pt-2 pb-0.5 min-h-[2.5rem] leading-[1.8]">
            <p
              className="text-sm text-muted truncate block py-0.5"
              dir="rtl"
              style={{ lineHeight: 2.5 }}
            >
              {banner.title?.ar_text || "—"}
            </p>
          </div>
          {surahLine ? (
            <p className="text-xs text-gray-500 truncate mt-0.5" title={surahLine}>
              {surahLine}
            </p>
          ) : null}
          <p className="text-xs text-gray-400 mt-1.5">
            Order: {banner.indexOrder}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onToggleEnabled(banner.id, !banner.enabled)}
          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
            banner.enabled
              ? "border-amber-200 text-amber-800 hover:bg-amber-50"
              : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          }`}
        >
          {banner.enabled ? "Hide from app" : "Show on app"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(banner)}
            className="p-2 hover:text-muted cursor-pointer text-primary hover:bg-primary-light border border-primary/10 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(banner.id)}
            className="p-2 hover:text-red-600 cursor-pointer text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableBannerItem;

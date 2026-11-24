import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  storyImageUrl,
  type StorySummary,
} from "@/libs/apis/islamic-stories.api";

interface Props {
  story: StorySummary;
  position: number;
  canEdit: boolean;
  canDelete: boolean;
  dragDisabled: boolean;
  actionsDisabled: boolean;
  onEdit: (story: StorySummary) => Promise<void>;
  onRemove: (story: StorySummary) => Promise<void>;
}

export default function SortableStoryRow({
  story,
  position,
  canEdit,
  canDelete,
  dragDisabled,
  actionsDisabled,
  onEdit,
  onRemove,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.story_id, disabled: dragDisabled });
  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={
        isDragging
          ? "relative z-10 bg-gray-50 shadow"
          : "bg-white hover:bg-gray-50/50"
      }
    >
      <td className="whitespace-nowrap px-3 py-3 text-sm tabular-nums text-gray-600">
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              disabled={dragDisabled}
              aria-label={`Move ${story.story_name.english}`}
              className="touch-none cursor-grab rounded p-2 hover:bg-gray-100 focus-visible:outline-primary active:cursor-grabbing disabled:cursor-default"
            >
              <GripVertical size={18} aria-hidden />
            </button>
          )}
          {position}
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
          {story.story_image ? (
            <img
              src={storyImageUrl(story.story_image)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon size={18} aria-hidden />
          )}
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="font-semibold text-gray-900">
          {story.story_name.english}
        </div>
        <div lang="ar" dir="rtl" className="mt-1 w-fit text-sm text-gray-600">
          {story.story_name.arabic}
        </div>
      </td>
      <td className="px-5 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            story.published
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {story.published ? "Published" : "Draft"}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3 text-right">
        {canEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={actionsDisabled}
            aria-label={`Edit ${story.story_name.english}`}
            onClick={() => void onEdit(story)}
          >
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={actionsDisabled}
            aria-label={`Delete ${story.story_name.english}`}
            className="text-red-600"
            onClick={() => void onRemove(story)}
          >
            Delete
          </Button>
        )}
      </td>
    </tr>
  );
}

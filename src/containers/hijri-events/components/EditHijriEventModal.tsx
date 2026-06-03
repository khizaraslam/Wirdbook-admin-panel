import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import type { HijriEventDTO } from "@/utils/helpers/models/hijri-events/hijri-event.dto";

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${imageUrl}`;
};

interface EditHijriEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, body: FormData) => void;
  event: HijriEventDTO | null;
}

interface FormValues {
  name: string;
  hijriMonth: number;
  hijriDay: number;
  isHighlighted?: boolean;
  arabicName: string;
  indexOrder?: number;
  icon: FileList | null;
}

const EditHijriEventModal: React.FC<EditHijriEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      hijriMonth: 1,
      hijriDay: 1,
      isHighlighted: false,
      arabicName: "",
      indexOrder: 0,
      icon: null,
    },
    mode: "onChange",
  });
  const watchIcon = watch("icon");
  const [removeCurrentIcon, setRemoveCurrentIcon] = useState(false);

  const handleClearIconSelection = () => {
    setValue("icon", null as any, { shouldValidate: true });
  };

  const handleRemoveCurrentIcon = () => {
    setValue("icon", null as any, { shouldValidate: true });
    setRemoveCurrentIcon(true);
  };

  useEffect(() => {
    if (event && isOpen) {
      reset({
        name: event.name,
        hijriMonth: event.hijriMonth,
        hijriDay: event.hijriDay,
        isHighlighted: event.isHighlighted,
        arabicName: event.arabicName || "",
        indexOrder: event.indexOrder,
        icon: null,
      });
      setRemoveCurrentIcon(false);
    }
  }, [event, isOpen, reset]);

  useEffect(() => {
    if (watchIcon && watchIcon.length > 0) {
      setRemoveCurrentIcon(false);
    }
  }, [watchIcon]);

  const onSubmit = (data: FormValues) => {
    if (!event) return;
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("hijriMonth", String(Number(data.hijriMonth)));
    formData.append("hijriDay", String(Number(data.hijriDay)));
    formData.append("arabicName", data.arabicName.trim());
    formData.append("isHighlighted", data.isHighlighted ? "true" : "false");
    if (data.indexOrder !== undefined) {
      formData.append("indexOrder", String(Number(data.indexOrder)));
    }
    if (removeCurrentIcon) {
      // Backend accepts empty string or "null" for icon removal.
      formData.append("icon", "");
    } else if (data.icon && data.icon.length > 0) {
      formData.append("icon", data.icon[0]);
    }
    onSave(event.id, formData);
    onClose();
  };

  const fullIconUrl =
    !removeCurrentIcon && event?.icon ? getImageUrl(event.icon) : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Hijri Event" className="">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Update event fields and optionally keep, replace, or remove the icon.
          </p>

          <Input
            label="Index order"
            type="number"
            placeholder="0"
            error={errors.indexOrder?.message}
            {...register("indexOrder", {
              min: { value: 0, message: "Must be at least 0" },
            })}
          />

          <Input
            label="Name (English) *"
            placeholder="e.g., Eid-ul-Fitr"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 1, message: "Name is required" },
            })}
          />

          <Input
            label="Arabic name"
            placeholder="e.g., عيد الفطر"
            className="text-right"
            dir="rtl"
            error={errors.arabicName?.message}
            {...register("arabicName", {
              required: "Arabic name is required",
              minLength: { value: 1, message: "Arabic name is required" },
            })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hijri month *"
              type="number"
              min={1}
              max={12}
              error={errors.hijriMonth?.message}
              {...register("hijriMonth", {
                required: "Required",
                min: { value: 1, message: "1–12" },
                max: { value: 12, message: "1–12" },
                valueAsNumber: true,
              })}
            />
            <Input
              label="Hijri day *"
              type="number"
              min={1}
              max={30}
              error={errors.hijriDay?.message}
              {...register("hijriDay", {
                required: "Required",
                min: { value: 1, message: "1–30" },
                max: { value: 30, message: "1–30" },
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="edit-hijri-highlighted"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...register("isHighlighted")}
            />
            <label htmlFor="edit-hijri-highlighted" className="form-label mb-0">
              Highlighted
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Event Icon
            </label>
            {fullIconUrl ? (
              <div className="mb-2">
                <p className="text-xs text-muted mb-1">Current icon:</p>
                <img
                  src={fullIconUrl}
                  alt={event?.name || "Event icon"}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>
            ) : null}
            {!watchIcon || watchIcon.length === 0 ? (
              <div className="space-y-2">
                <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors min-h-[90px]">
                  <span className="text-gray-400 text-sm">
                    {fullIconUrl ? "Change icon (optional)" : "Upload icon"}
                  </span>
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    className="hidden"
                    {...register("icon")}
                  />
                </label>
                {fullIconUrl ? (
                  <button
                    type="button"
                    onClick={handleRemoveCurrentIcon}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove current icon
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="form-input flex items-center justify-between py-2 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {watchIcon[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearIconSelection}
                  className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid}
              className="rounded-md px-5 py-2.5 btn-primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditHijriEventModal;

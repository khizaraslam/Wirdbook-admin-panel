import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import type { BannerType } from "@/utils/helpers/models/banners/banner.dto";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  defaultOrder: number;
}

export interface BannerFormInputs {
  type: BannerType;
  isEnabled: boolean;
  arText: string;
  enText: string;
  surahNameAr: string;
  surahNameEn: string;
  surahReferenceAr: string;
  surahReferenceEn: string;
  indexOrder: number;
  image: FileList | null;
}

const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultOrder,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BannerFormInputs>({
    defaultValues: {
      type: "banner",
      isEnabled: true,
      arText: "",
      enText: "",
      surahNameAr: "",
      surahNameEn: "",
      surahReferenceAr: "",
      surahReferenceEn: "",
      indexOrder: defaultOrder,
      image: null,
    },
    mode: "onChange",
  });

  const watchImage = watch("image");
  const watchType = watch("type");

  const handleClearImage = () => {
    setValue("image", null as any, { shouldValidate: true });
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        type: "banner",
        isEnabled: true,
        arText: "",
        enText: "",
        surahNameAr: "",
        surahNameEn: "",
        surahReferenceAr: "",
        surahReferenceEn: "",
        indexOrder: defaultOrder,
        image: null,
      });
    }
  }, [isOpen, defaultOrder, reset]);

  const onSubmit = (data: BannerFormInputs) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("isEnabled", data.isEnabled ? "true" : "false");
    if (data.arText?.trim()) formData.append("arText", data.arText.trim());
    if (data.enText?.trim()) formData.append("enText", data.enText.trim());
    formData.append("indexOrder", String(data.indexOrder ?? defaultOrder));
    if (data.type === "text") {
      if (data.surahNameAr?.trim())
        formData.append("surahNameAr", data.surahNameAr.trim());
      if (data.surahNameEn?.trim())
        formData.append("surahNameEn", data.surahNameEn.trim());
      if (data.surahReferenceAr?.trim())
        formData.append("surahReferenceAr", data.surahReferenceAr.trim());
      if (data.surahReferenceEn?.trim())
        formData.append("surahReferenceEn", data.surahReferenceEn.trim());
    }
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    onAdd(formData);
    onClose();
  };

  const isText = watchType === "text";
  const isBanner = watchType === "banner";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Banner"
      className="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Banner: image carousel style (title + image; do not send surah). Text:
            surah/verse block (title + optional surah fields + optional image).
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">Type</label>
            <select
              className="form-input"
              {...register("type")}
            >
              <option value="banner">Banner — image + title</option>
              <option value="text">Text — title + surah (+ optional image)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="add-banner-enabled"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...register("isEnabled")}
            />
            <label htmlFor="add-banner-enabled" className="form-label mb-0">
              Visible on public list (enabled)
            </label>
          </div>

          <Input
            label="Order"
            type="number"
            placeholder="e.g., 0"
            error={errors.indexOrder?.message}
            {...register("indexOrder", {
              min: { value: 0, message: "Must be at least 0" },
            })}
          />

          <Input
            label="Arabic title"
            placeholder="e.g., اسم الله سُبْحَانَهُ وَتَعَالَىٰ"
            className="text-right"
            dir="rtl"
            {...register("arText")}
          />

          <Input
            label="English title"
            placeholder="e.g., Allah (SWT)"
            error={errors.enText?.message}
            {...register("enText")}
          />

          {isText ? (
            <div className="space-y-4 rounded-xl border border-gray-100 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-gray-900">Surah (optional)</p>
              <Input
                label="Surah name (Arabic)"
                className="text-right"
                dir="rtl"
                {...register("surahNameAr")}
              />
              <Input
                label="Surah name (English)"
                {...register("surahNameEn")}
              />
              <Input
                label="Surah reference (Arabic)"
                className="text-right"
                dir="rtl"
                {...register("surahReferenceAr")}
              />
              <Input
                label="Surah reference (English)"
                {...register("surahReferenceEn")}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              {isBanner ? "Banner image" : "Image (optional)"}{" "}
              {isBanner ? "(optional)" : ""}
            </label>
            {!watchImage || watchImage.length === 0 ? (
              <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors min-h-[120px]">
                <span className="text-gray-400 text-sm">Upload image (max 10MB)</span>
                <UploadCloud className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  {...register("image")}
                />
              </label>
            ) : (
              <div className="form-input flex items-center justify-between py-2 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {watchImage[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
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
              className="rounded-md px-5 py-2.5 btn-secondary"
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
              Add Banner
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddBannerModal;

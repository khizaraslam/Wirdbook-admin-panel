import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import type { BannerDTO, BannerType } from "@/utils/helpers/models/banners/banner.dto";

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${imageUrl}`;
};

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: FormData, method?: "put" | "patch") => void;
  banner: BannerDTO | null;
}

export interface EditBannerFormInputs {
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

const EditBannerModal: React.FC<EditBannerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  banner,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<EditBannerFormInputs>({
    defaultValues: {
      type: "banner",
      isEnabled: true,
      arText: "",
      enText: "",
      surahNameAr: "",
      surahNameEn: "",
      surahReferenceAr: "",
      surahReferenceEn: "",
      indexOrder: 0,
      image: null,
    },
    mode: "onChange",
  });

  const watchImage = watch("image");
  const watchType = watch("type");
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  const handleClearImage = () => {
    setValue("image", null as any, { shouldValidate: true });
  };

  const handleRemoveCurrentImage = () => {
    setValue("image", null as any, { shouldValidate: true });
    setRemoveCurrentImage(true);
  };

  useEffect(() => {
    if (banner && isOpen) {
      reset({
        type: banner.type,
        isEnabled: banner.enabled,
        arText: banner.title?.ar_text || "",
        enText: banner.title?.en_text || "",
        surahNameAr: banner.surah_name?.ar_text || "",
        surahNameEn: banner.surah_name?.en_text || "",
        surahReferenceAr: banner.surah_reference?.ar_text || "",
        surahReferenceEn: banner.surah_reference?.en_text || "",
        indexOrder: banner.indexOrder ?? 0,
        image: null,
      });
      setRemoveCurrentImage(false);
    }
  }, [banner, isOpen, reset]);

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      setRemoveCurrentImage(false);
    }
  }, [watchImage]);

  const onSubmit = (data: EditBannerFormInputs) => {
    if (!banner) return;
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("isEnabled", data.isEnabled ? "true" : "false");
    formData.append("arText", data.arText?.trim() ?? "");
    formData.append("enText", data.enText?.trim() ?? "");
    formData.append("indexOrder", String(data.indexOrder ?? banner.indexOrder));
    if (data.type === "text") {
      formData.append("surahNameAr", data.surahNameAr?.trim() ?? "");
      formData.append("surahNameEn", data.surahNameEn?.trim() ?? "");
      formData.append("surahReferenceAr", data.surahReferenceAr?.trim() ?? "");
      formData.append("surahReferenceEn", data.surahReferenceEn?.trim() ?? "");
    }
    if (removeCurrentImage) {
      formData.append("image", "null");
    } else if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    onSave(banner.id, formData, "put");
    onClose();
  };

  const fullImageUrl = banner ? getImageUrl(banner.image) : "";
  const isText = watchType === "text";
  const isBanner = watchType === "banner";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Banner" className="">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Banner: image + title only (surah not used). Text: title + optional surah
            name/reference (AR/EN) and optional image.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">Type</label>
            <select className="form-input" {...register("type")}>
              <option value="banner">Banner — image + title</option>
              <option value="text">Text — title + surah (+ optional image)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="edit-banner-enabled"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...register("isEnabled")}
            />
            <label htmlFor="edit-banner-enabled" className="form-label mb-0">
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
              <p className="text-sm font-semibold text-gray-900">Surah</p>
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
              {isBanner ? "Banner image" : "Image (optional)"}
            </label>
            {fullImageUrl && (
              <div className="mb-2">
                <p className="text-xs text-muted mb-1">Current image:</p>
                <img
                  src={fullImageUrl}
                  alt={banner?.title?.en_text || banner?.title?.ar_text || "Banner"}
                  className="w-full max-h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            {!watchImage || watchImage.length === 0 ? (
              <div className="space-y-2">
                <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors min-h-[80px]">
                  <span className="text-gray-400 text-sm">
                    {fullImageUrl ? "Change image (optional)" : "Upload image"}
                  </span>
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    {...register("image")}
                  />
                </label>
                {fullImageUrl ? (
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove current image
                  </button>
                ) : null}
              </div>
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

export default EditBannerModal;

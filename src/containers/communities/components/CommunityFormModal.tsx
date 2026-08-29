import React from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getCommunityImageUrl } from "@/utils/helpers/communities/helpers";
import type { CommunityFormPayload } from "../useHooks";

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CommunityFormPayload) => Promise<boolean>;
  initialName?: string;
  initialImageUrl?: string | null;
  title: string;
  submitLabel: string;
}

type FormValues = {
  name: string;
  image: FileList | null;
};

const CommunityFormModal: React.FC<CommunityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialImageUrl = null,
  title,
  submitLabel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: initialName, image: null } });

  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const watchImage = watch("image");
  const isEditing = !!initialImageUrl && !removeCurrentImage;

  React.useEffect(() => {
    if (isOpen) {
      reset({ name: initialName, image: null });
      setRemoveCurrentImage(false);
    }
  }, [isOpen, initialName, reset]);

  const previewUrl = React.useMemo(() => {
    if (watchImage && watchImage.length > 0) {
      return URL.createObjectURL(watchImage[0]);
    }
    if (isEditing) return getCommunityImageUrl(initialImageUrl);
    return "";
  }, [watchImage, isEditing, initialImageUrl]);

  React.useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleClearNewImage = () => {
    setValue("image", null as unknown as FileList, { shouldValidate: true });
  };

  const handleRemoveCurrentImage = () => {
    setValue("image", null as unknown as FileList, { shouldValidate: true });
    setRemoveCurrentImage(true);
  };

  const submit = async (data: FormValues) => {
    const newImage =
      data.image && data.image.length > 0 ? data.image[0] : undefined;
    const ok = await onSubmit({
      name: data.name.trim(),
      image: newImage,
      removeImage: removeCurrentImage && !newImage,
    });
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <Input
          label="Community name *"
          placeholder="e.g. Cape Town"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            maxLength: { value: 120, message: "Max 120 characters" },
          })}
        />

        <div className="mt-4">
          <label className="form-label">Cover image (optional)</label>
          <p className="form-hint mb-2">Max 10 MB. JPG or PNG recommended.</p>

          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <img
                src={previewUrl}
                alt="Community preview"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={
                  watchImage?.length
                    ? handleClearNewImage
                    : handleRemoveCurrentImage
                }
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
              <UploadCloud size={28} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image")}
              />
            </label>
          )}

          {previewUrl && (
            <label className="inline-flex items-center gap-2 mt-3 text-sm text-primary cursor-pointer hover:underline">
              <ImageIcon size={14} />
              Replace image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image")}
              />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CommunityFormModal;

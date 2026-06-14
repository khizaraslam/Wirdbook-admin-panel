import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AddTabDTO } from "@/utils/helpers/models/tabs/create-tabs.dto";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, slug: string, order: number) => void;
  defaultOrder: number;
  contentType: ContentType;
}

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const AddTabModal: React.FC<AddTabModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultOrder,
  contentType,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<AddTabDTO>({
    defaultValues: { label: "", slug: "", order: defaultOrder },
    mode: "onChange",
  });

  // Auto-generate slug from label while slug hasn't been manually typed
  const labelValue = watch("label");
  useEffect(() => {
    setValue("slug", toSlug(labelValue), { shouldValidate: false });
  }, [labelValue, setValue]);

  // Reset form when modal opens or defaultOrder changes
  useEffect(() => {
    if (isOpen) {
      reset({
        label: "",
        slug: "",
        order: defaultOrder,
      });
    }
  }, [isOpen, defaultOrder, reset]);

  const onSubmit = ({ label, slug, order }: AddTabDTO) => {
    onAdd(label.trim(), slug || toSlug(label), Number(order));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add New ${contentType === "english" ? "English" : "Arabic"} Tab`}
      className="max-h-[90vh]"
    >
      {/* RHF handleSubmit wraps the <form> so Enter key also submits */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Create a new category for lectures
          </p>

          {/* Order */}
          <Input
            label="Order"
            type="number"
            placeholder="e.g., 1"
            error={errors.order?.message}
            {...register("order", {
              required: "Order is required",
              min: { value: 0, message: "Must be at least 0" },
            })}
          />

          {/* Label */}
          <Input
            label="Label *"
            placeholder={contentType === "arabic" ? "e.g., حكم" : "e.g., Wisdoms"}
            dir={contentType === "arabic" ? "rtl" : undefined}
            error={errors.label?.message}
            {...register("label", {
              required: "Label is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
          />

          {/* Slug — muted background, read-lighter feel */}
          <Input
            label="Slug"
            placeholder="Auto-generated from label"
            hint="Edit to override the auto-generated slug"
            muted
            {...register("slug")}
          />

          {/* Actions */}
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
              Add Tab
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTabModal;

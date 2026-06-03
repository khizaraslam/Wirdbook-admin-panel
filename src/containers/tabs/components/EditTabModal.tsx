import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import { UpdateTabDTO } from "@/utils/helpers/models/tabs/update-tab.dto";

interface EditTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, label: string, slug: string, order: number) => void;
  tab: TabsDTO | null;
}

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const EditTabModal: React.FC<EditTabModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tab,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateTabDTO>({
    defaultValues: { label: "", slug: "", order: 0 },
    mode: "onChange",
  });

  // Pre-fill form when tab is selected for editing
  useEffect(() => {
    if (tab && isOpen) {
      reset({
        label: tab.label,
        slug: tab.slug,
        order: tab.order,
      });
    }
  }, [tab, isOpen, reset]);

  // Handle manual input and auto-slug generation
  const labelValue = watch("label");
  useEffect(() => {
    // Only auto-generate if we want strictly synced labels,
    // but for editing it's usually better to keep manually edited slugs.
  }, [labelValue]);

  const onSubmit = ({ label, slug, order }: UpdateTabDTO) => {
    if (tab) {
      if (isDirty) {
        onSave(tab.id, label.trim(), slug || toSlug(label), Number(order));
      }
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tab" className="">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Modify the category details
          </p>

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

          <Input
            label="Label *"
            placeholder="e.g., Wisdoms"
            error={errors.label?.message}
            {...register("label", {
              required: "Label is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
          />

          <Input
            label="Slug"
            placeholder="Auto-generated from label"
            hint="The unique identifier for this category"
            muted
            {...register("slug")}
          />

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

export default EditTabModal;

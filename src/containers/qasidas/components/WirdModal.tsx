import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { QasidaWird } from "@/utils/helpers/models/qasidas/qasida.dto";

interface WirdFormValues {
  descriptionEn: string;
  descriptionAr: string;
  transliteration: string;
  repetition: number;
  isTitle: boolean;
}

interface WirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: WirdFormValues) => Promise<void>;
  wird?: QasidaWird | null;
}

const WirdModal: React.FC<WirdModalProps> = ({
  isOpen,
  onClose,
  onSave,
  wird,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<WirdFormValues>({
    defaultValues: {
      descriptionEn: "",
      descriptionAr: "",
      transliteration: "",
      repetition: 0,
      isTitle: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        descriptionEn: wird?.description.en || "",
        descriptionAr: wird?.description.ar || "",
        transliteration: wird?.transliteration || "",
        repetition: wird?.repetition ?? 0,
        isTitle: wird?.isTitle ?? false,
      });
    }
  }, [isOpen, wird, reset]);

  const onSubmit = async (data: WirdFormValues) => {
    await onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wird ? "Edit Wird" : "Add Wird"}
      className="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Description (English) *"
          error={errors.descriptionEn?.message}
          {...register("descriptionEn", { required: "Required" })}
        />
        <Input
          label="Description (Arabic) *"
          className="text-right"
          dir="rtl"
          error={errors.descriptionAr?.message}
          {...register("descriptionAr", { required: "Required" })}
        />
        <Input
          label="Transliteration"
          {...register("transliteration")}
        />
        <Input
          label="Repetition"
          type="number"
          min={0}
          {...register("repetition", { valueAsNumber: true })}
        />
        <div className="flex items-center gap-3">
          <input
            id="wird-is-title"
            type="checkbox"
            className="rounded border-gray-300 text-primary"
            {...register("isTitle")}
          />
          <label htmlFor="wird-is-title" className="form-label mb-0">
            Section title (isTitle)
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WirdModal;

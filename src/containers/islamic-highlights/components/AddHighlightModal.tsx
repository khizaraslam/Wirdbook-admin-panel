import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import HighlightFormFields, {
  HighlightFormInputs,
} from "./HighlightFormFields";
import FileUploadField from "./FileUploadField";
import { appendHighlightFormData } from "@/utils/helpers/islamic-highlights/helpers";

interface AddHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => Promise<boolean>;
  defaultOrder: number;
}

const AddHighlightModal: React.FC<AddHighlightModalProps> = ({
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
    formState: { errors, isSubmitting },
  } = useForm<HighlightFormInputs>({
    defaultValues: {
      timeSlot: "whole_day",
      messageType: "verse",
      messageAr: "",
      messageEn: "",
      sourceAr: "",
      sourceEn: "",
      scheduleMode: "default",
      dayOfWeek: "",
      hijriMonth: "",
      hijriDay: "",
      isEnabled: true,
      indexOrder: defaultOrder,
      audio: null,
      image: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        timeSlot: "whole_day",
        messageType: "verse",
        messageAr: "",
        messageEn: "",
        sourceAr: "",
        sourceEn: "",
        scheduleMode: "default",
        dayOfWeek: "",
        hijriMonth: "",
        hijriDay: "",
        isEnabled: true,
        indexOrder: defaultOrder,
        audio: null,
        image: null,
      });
    }
  }, [isOpen, defaultOrder, reset]);

  const onSubmit = async (data: HighlightFormInputs) => {
    const formData = new FormData();
    appendHighlightFormData(formData, data, {
      audio: data.audio?.[0] ?? null,
      image: data.image?.[0] ?? null,
    });
    const ok = await onAdd(formData);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Islamic Highlight"
      className="max-w-2xl max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <HighlightFormFields
          register={register}
          errors={errors}
          watch={watch}
          audioSection={
            <FileUploadField
              label="Audio snippet (optional, max 50MB)"
              field="audio"
              accept="audio/*"
              hint="Upload audio"
              register={register}
              watch={watch}
              setValue={setValue}
            />
          }
          imageSection={
            <FileUploadField
              label="Share image (optional, max 50MB)"
              field="image"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hint="Upload image"
              register={register}
              watch={watch}
              setValue={setValue}
            />
          }
        />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Add Highlight
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHighlightModal;

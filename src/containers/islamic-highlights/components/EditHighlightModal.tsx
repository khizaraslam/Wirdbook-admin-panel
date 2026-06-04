import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import HighlightFormFields, {
  HighlightFormInputs,
} from "./HighlightFormFields";
import FileUploadField from "./FileUploadField";
import { appendHighlightFormData } from "@/utils/helpers/islamic-highlights/helpers";
import type { IslamicHighlightDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";

interface EditHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: FormData,
    method?: "put" | "patch",
  ) => Promise<boolean>;
  highlight: IslamicHighlightDTO | null;
}

const EditHighlightModal: React.FC<EditHighlightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  highlight,
}) => {
  const [removeAudio, setRemoveAudio] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HighlightFormInputs>({
    defaultValues: {
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
      indexOrder: 0,
      audio: null,
      image: null,
    },
  });

  useEffect(() => {
    if (highlight && isOpen) {
      const s = highlight.schedule;
      reset({
        messageType: highlight.messageType,
        messageAr: highlight.message.ar,
        messageEn: highlight.message.en,
        sourceAr: highlight.source.ar,
        sourceEn: highlight.source.en,
        scheduleMode: s.mode,
        dayOfWeek:
          s.dayOfWeek !== null ? String(s.dayOfWeek) : "",
        hijriMonth:
          s.hijriMonth !== null ? String(s.hijriMonth) : "",
        hijriDay: s.hijriDay !== null ? String(s.hijriDay) : "",
        isEnabled: highlight.enabled,
        indexOrder: highlight.indexOrder,
        audio: null,
        image: null,
      });
      setRemoveAudio(false);
      setRemoveImage(false);
    }
  }, [highlight, isOpen, reset]);

  const watchAudio = watch("audio");
  const watchImage = watch("image");

  useEffect(() => {
    if (watchAudio?.length) setRemoveAudio(false);
  }, [watchAudio]);

  useEffect(() => {
    if (watchImage?.length) setRemoveImage(false);
  }, [watchImage]);

  const onSubmit = async (data: HighlightFormInputs) => {
    if (!highlight) return;
    const formData = new FormData();
    appendHighlightFormData(formData, data, {
      audio: data.audio?.[0] ?? null,
      image: data.image?.[0] ?? null,
      removeAudio,
      removeImage,
    });
    const ok = await onSave(highlight.id, formData, "put");
    if (ok) onClose();
  };

  if (!highlight) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Islamic Highlight"
      className="max-w-2xl max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <HighlightFormFields
          register={register}
          errors={errors}
          watch={watch}
          audioSection={
            <FileUploadField
              label="Audio snippet"
              field="audio"
              accept="audio/*"
              hint="Replace audio"
              register={register}
              watch={watch}
              setValue={setValue}
              currentUrl={highlight.audioUrl}
              showCurrent={!!highlight.audioUrl}
              onRemoveCurrent={() => {
                setRemoveAudio(true);
                setValue("audio", null as unknown as FileList);
              }}
            />
          }
          imageSection={
            <FileUploadField
              label="Share image"
              field="image"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hint="Replace image"
              register={register}
              watch={watch}
              setValue={setValue}
              currentUrl={highlight.imageUrl}
              showCurrent={!!highlight.imageUrl}
              onRemoveCurrent={() => {
                setRemoveImage(true);
                setValue("image", null as unknown as FileList);
              }}
            />
          }
        />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditHighlightModal;

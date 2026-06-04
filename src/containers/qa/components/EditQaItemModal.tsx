import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { UpdateQaItemDTO } from "@/utils/helpers/models/qa/update-qa-item.dto";

interface EditQaItemModalProps {
  isOpen: boolean;
  item: QaItemDTO | null;
  onClose: () => void;
  onSave: (id: string, body: UpdateQaItemDTO) => Promise<boolean>;
  tags: QaTagDTO[];
}

const EditQaItemModal: React.FC<EditQaItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  tags,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateQaItemDTO>();

  useEffect(() => {
    if (isOpen && item) {
      reset({
        questionEn: item.questionEn,
        questionAr: item.questionAr,
        answerEn: item.answerEn,
        answerAr: item.answerAr,
        tagId: item.tagId ?? "",
        isPublished: item.isPublished,
        indexOrder: item.indexOrder,
      });
    }
  }, [isOpen, item, reset]);

  if (!item) return null;

  const onSubmit = async (data: UpdateQaItemDTO) => {
    const body = new UpdateQaItemDTO({
      questionEn: data.questionEn?.trim(),
      questionAr: data.questionAr?.trim(),
      answerEn: data.answerEn?.trim(),
      answerAr: data.answerAr?.trim(),
      tagId: data.tagId ? String(data.tagId) : null,
      isPublished: data.isPublished,
      indexOrder: Number(data.indexOrder),
    });
    const ok = await onSave(item.id, body);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Q&A Item"
      className="max-w-2xl max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Question (English) *"
              error={errors.questionEn?.message}
              {...register("questionEn", { required: "Required" })}
            />
            <Textarea
              label="Question (Arabic) *"
              dir="rtl"
              error={errors.questionAr?.message}
              {...register("questionAr", { required: "Required" })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Answer (English) *"
              rows={5}
              error={errors.answerEn?.message}
              {...register("answerEn", { required: "Required" })}
            />
            <Textarea
              label="Answer (Arabic) *"
              rows={5}
              dir="rtl"
              error={errors.answerAr?.message}
              {...register("answerAr", { required: "Required" })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Tag</label>
              <select className="form-input" {...register("tagId")}>
                <option value="">No tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.labelEn}
                    {tag.labelAr ? ` / ${tag.labelAr}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Display order"
              type="number"
              {...register("indexOrder", { valueAsNumber: true })}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...register("isPublished")}
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditQaItemModal;

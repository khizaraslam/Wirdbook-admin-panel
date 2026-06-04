import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { CreateQaItemDTO } from "@/utils/helpers/models/qa/create-qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";

interface AddQaItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (body: CreateQaItemDTO) => Promise<boolean>;
  tags: QaTagDTO[];
  defaultIndexOrder: number;
}

const AddQaItemModal: React.FC<AddQaItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  tags,
  defaultIndexOrder,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateQaItemDTO>({
    defaultValues: new CreateQaItemDTO({
      isPublished: false,
      indexOrder: defaultIndexOrder,
    }),
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        new CreateQaItemDTO({
          isPublished: false,
          indexOrder: defaultIndexOrder,
        }),
      );
    }
  }, [isOpen, defaultIndexOrder, reset]);

  const onSubmit = async (data: CreateQaItemDTO) => {
    const body = new CreateQaItemDTO({
      ...data,
      questionEn: data.questionEn.trim(),
      questionAr: data.questionAr.trim(),
      answerEn: data.answerEn.trim(),
      answerAr: data.answerAr.trim(),
      tagId: data.tagId || undefined,
      indexOrder: Number(data.indexOrder ?? defaultIndexOrder),
    });
    const ok = await onAdd(body);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Q&A Item"
      className="max-w-2xl max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Bilingual question and answer for the mobile app
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Question (English) *"
              placeholder="Enter question in English"
              error={errors.questionEn?.message}
              {...register("questionEn", {
                required: "English question is required",
              })}
            />
            <Textarea
              label="Question (Arabic) *"
              placeholder="أدخل السؤال بالعربية"
              dir="rtl"
              error={errors.questionAr?.message}
              {...register("questionAr", {
                required: "Arabic question is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Answer (English) *"
              rows={5}
              placeholder="Enter answer in English"
              error={errors.answerEn?.message}
              {...register("answerEn", {
                required: "English answer is required",
              })}
            />
            <Textarea
              label="Answer (Arabic) *"
              rows={5}
              placeholder="أدخل الإجابة بالعربية"
              dir="rtl"
              error={errors.answerAr?.message}
              {...register("answerAr", {
                required: "Arabic answer is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Tag</label>
              <select
                className="form-input"
                {...register("tagId")}
              >
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
            <span className="text-sm font-medium text-gray-700">
              Publish immediately
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="rounded-md px-5 py-2.5 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="rounded-md px-5 py-2.5 btn-primary"
            >
              Add Q&A
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddQaItemModal;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { CreateQaItemDTO } from "@/utils/helpers/models/qa/create-qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import type { QaVisibility } from "@/utils/helpers/models/qa/qa.enums";
import { QA_VISIBILITY_FORM_OPTIONS } from "@/utils/helpers/models/qa/qa.enums";
import {
  canPublishQaItem,
  hasQuestionText,
} from "@/utils/helpers/qa/helpers";

interface AddQaItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (body: CreateQaItemDTO) => Promise<boolean>;
  tags: QaTagDTO[];
  defaultIndexOrder: number;
}

type AddQaFormValues = {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  visibility: QaVisibility;
  tagId: string;
  isPublished: boolean;
  indexOrder: number;
};

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddQaFormValues>({
    defaultValues: {
      questionEn: "",
      questionAr: "",
      answerEn: "",
      answerAr: "",
      visibility: "public",
      tagId: "",
      isPublished: false,
      indexOrder: defaultIndexOrder,
    },
  });

  const formValues = watch();
  const publishReady = canPublishQaItem(formValues);
  const selectedVisibility = QA_VISIBILITY_FORM_OPTIONS.find(
    (option) => option.value === formValues.visibility,
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        questionEn: "",
        questionAr: "",
        answerEn: "",
        answerAr: "",
        visibility: "public",
        tagId: "",
        isPublished: false,
        indexOrder: defaultIndexOrder,
      });
    }
  }, [isOpen, defaultIndexOrder, reset]);

  const onSubmit = async (data: AddQaFormValues) => {
    if (!hasQuestionText(data)) return;

    const body = new CreateQaItemDTO({
      questionEn: data.questionEn.trim() || undefined,
      questionAr: data.questionAr.trim() || undefined,
      answerEn: data.answerEn.trim() || undefined,
      answerAr: data.answerAr.trim() || undefined,
      visibility: data.visibility,
      tagId: data.tagId || null,
      isPublished: publishReady ? data.isPublished : false,
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
            Admin-authored Q&A. Answers are optional until you publish.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Question (English)"
              placeholder="Enter question in English"
              error={errors.questionEn?.message}
              {...register("questionEn")}
            />
            <Textarea
              label="Question (Arabic)"
              placeholder="أدخل السؤال بالعربية"
              dir="rtl"
              error={errors.questionAr?.message}
              {...register("questionAr")}
            />
          </div>
          {!hasQuestionText(formValues) && (
            <p className="text-[11px] text-red-500">
              At least one question language is required.
            </p>
          )}

          <div className="rounded-xl border border-gray-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Visibility after publish</label>
              <select className="form-input" {...register("visibility")}>
                {QA_VISIBILITY_FORM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted">
              {selectedVisibility?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Answer (English)"
              rows={5}
              placeholder="Enter answer in English (optional)"
              error={errors.answerEn?.message}
              {...register("answerEn")}
            />
            <Textarea
              label="Answer (Arabic)"
              rows={5}
              placeholder="أدخل الإجابة بالعربية (اختياري)"
              dir="rtl"
              error={errors.answerAr?.message}
              {...register("answerAr")}
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
              disabled={!publishReady}
              {...register("isPublished")}
            />
            <span
              className={`text-sm font-medium ${publishReady ? "text-gray-700" : "text-gray-400"}`}
            >
              Publish immediately (requires EN + AR answers)
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!hasQuestionText(formValues)}
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

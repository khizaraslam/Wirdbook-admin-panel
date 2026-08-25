import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { CreateQaTagDTO } from "@/utils/helpers/models/qa/create-qa-tag.dto";
import { UpdateQaItemDTO } from "@/utils/helpers/models/qa/update-qa-item.dto";
import type { QaVisibility } from "@/utils/helpers/models/qa/qa.enums";
import { QA_VISIBILITY_FORM_OPTIONS } from "@/utils/helpers/models/qa/qa.enums";
import {
  canPublishQaItem,
  canPublishQaStatus,
  canRejectQaItem,
  canUnpublishQaItem,
  formatQaSourceLabel,
  formatQaStatusLabel,
  formatQaVisibilityLabel,
  getAskerDisplayName,
  hasQuestionText,
  QA_SOURCE_STYLES,
  QA_STATUS_STYLES,
  QA_VISIBILITY_STYLES,
  type QaTagMutationResult,
} from "@/utils/helpers/qa/helpers";
import InlineCreateTag from "./InlineCreateTag";

interface EditQaItemModalProps {
  isOpen: boolean;
  item: QaItemDTO | null;
  onClose: () => void;
  onSave: (id: string, body: UpdateQaItemDTO) => Promise<boolean>;
  onPublish: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
  onUnpublish: (id: string) => Promise<boolean>;
  tags: QaTagDTO[];
  createTag: (body: CreateQaTagDTO) => Promise<QaTagMutationResult>;
  onTagsRefresh: () => Promise<QaTagDTO[]> | void;
}

type EditQaFormValues = {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  visibility: QaVisibility;
  tagId: string;
  indexOrder: number;
};

const EditQaItemModal: React.FC<EditQaItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  onPublish,
  onReject,
  onUnpublish,
  tags,
  createTag,
  onTagsRefresh,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditQaFormValues>();

  useEffect(() => {
    if (isOpen && item) {
      reset({
        questionEn: item.questionEn ?? "",
        questionAr: item.questionAr ?? "",
        answerEn: item.answerEn ?? "",
        answerAr: item.answerAr ?? "",
        visibility: item.visibility,
        tagId: item.tagId ?? "",
        indexOrder: item.indexOrder,
      });
    }
  }, [isOpen, item, reset]);

  if (!item) return null;

  const formValues = watch();
  const publishReady = canPublishQaItem(formValues);
  const askerName = getAskerDisplayName(item);
  const selectedVisibility = QA_VISIBILITY_FORM_OPTIONS.find(
    (option) => option.value === formValues.visibility,
  );

  const buildBody = (data: EditQaFormValues) =>
    new UpdateQaItemDTO({
      questionEn: data.questionEn.trim() || null,
      questionAr: data.questionAr.trim() || null,
      answerEn: data.answerEn.trim() || null,
      answerAr: data.answerAr.trim() || null,
      visibility: data.visibility,
      tagId: data.tagId ? String(data.tagId) : null,
      indexOrder: Number(data.indexOrder),
    });

  const onSubmit = async (data: EditQaFormValues) => {
    if (!hasQuestionText(data)) return;
    const ok = await onSave(item.id, buildBody(data));
    if (ok) onClose();
  };

  const handlePublish = async () => {
    if (!publishReady) return;
    const saved = await onSave(item.id, buildBody(formValues));
    if (!saved) return;
    const ok = await onPublish(item.id);
    if (ok) onClose();
  };

  const handleReject = async () => {
    const ok = await onReject(item.id);
    if (ok) onClose();
  };

  const handleUnpublish = async () => {
    const ok = await onUnpublish(item.id);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        item.source === "user" && item.status === "submitted"
          ? "Moderate Submitted Question"
          : "Edit Q&A Item"
      }
      className="max-w-2xl max-h-[90vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_STATUS_STYLES[item.status]}`}
            >
              {formatQaStatusLabel(item.status)}
            </span>
            <span
              className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_SOURCE_STYLES[item.source]}`}
            >
              {formatQaSourceLabel(item.source)}
            </span>
            <span
              className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_VISIBILITY_STYLES[item.visibility]}`}
            >
              {formatQaVisibilityLabel(item.visibility)}
            </span>
          </div>

          {item.source === "user" && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">
              <p className="text-xs font-semibold text-violet-900 uppercase tracking-wider">
                Submitted by
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {askerName}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Question (English)"
              error={errors.questionEn?.message}
              {...register("questionEn")}
            />
            <Textarea
              label="Question (Arabic)"
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
              {selectedVisibility?.description ??
                "Status (submitted/draft/published) is separate from visibility (public/private)."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Answer (English)"
              rows={5}
              error={errors.answerEn?.message}
              {...register("answerEn")}
            />
            <Textarea
              label="Answer (Arabic)"
              rows={5}
              dir="rtl"
              error={errors.answerAr?.message}
              {...register("answerAr")}
            />
          </div>
          {!publishReady && (
            <p className="text-xs text-muted">
              Both EN and AR answers are required before publishing.
            </p>
          )}

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
              <InlineCreateTag
                createTag={createTag}
                onCreated={async (tag) => {
                  const refreshed = await onTagsRefresh();
                  const selectedId =
                    tag.id ||
                    refreshed?.find(
                      (t) =>
                        t.slug === tag.slug || t.labelEn === tag.labelEn,
                    )?.id ||
                    "";
                  if (selectedId) {
                    setValue("tagId", selectedId, { shouldDirty: true });
                  }
                }}
              />
            </div>
            <Input
              label="Display order"
              type="number"
              {...register("indexOrder", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {canPublishQaStatus(item.status) && (
                <Button
                  type="button"
                  variant="primary"
                  disabled={!publishReady || isSubmitting}
                  onClick={handlePublish}
                  title={
                    publishReady
                      ? "Save and publish"
                      : "Fill EN + AR answers first"
                  }
                >
                  Publish
                </Button>
              )}
              {canRejectQaItem(item.status) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReject}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>
              )}
              {canUnpublishQaItem(item.status) && (
                <Button type="button" variant="outline" onClick={handleUnpublish}>
                  Unpublish
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!hasQuestionText(formValues)}
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditQaItemModal;

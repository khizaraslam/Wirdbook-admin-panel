import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import type { QaSource, QaStatus, QaVisibility } from "@/utils/helpers/models/qa/qa.enums";

export const QA_TAG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const QA_TAG_SLUG_VALIDATION_MESSAGE =
  "slug must be lowercase letters, numbers, and hyphens only";

export const toQaTagSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export interface QaFieldError {
  code: string;
  field: string | null;
  message: string;
}

export type QaTagMutationResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

const hasText = (value: string | null | undefined): boolean =>
  Boolean(value?.trim());

export const hasQuestionText = (item: {
  questionEn?: string | null;
  questionAr?: string | null;
}): boolean => hasText(item.questionEn) || hasText(item.questionAr);

export const canPublishQaItem = (item: {
  answerEn?: string | null;
  answerAr?: string | null;
}): boolean => hasText(item.answerEn) && hasText(item.answerAr);

export const needsAnswer = (item: QaItemDTO): boolean =>
  !hasText(item.answerEn) || !hasText(item.answerAr);

export const QA_STATUS_LABELS: Record<QaStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  rejected: "Rejected",
  published: "Published",
};

export const QA_STATUS_STYLES: Record<QaStatus, string> = {
  draft: "bg-amber-100 text-amber-700",
  submitted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  published: "bg-green-100 text-green-700",
};

export const QA_SOURCE_LABELS: Record<QaSource, string> = {
  admin: "Admin",
  user: "User",
};

export const QA_SOURCE_STYLES: Record<QaSource, string> = {
  admin: "bg-slate-100 text-slate-700",
  user: "bg-violet-100 text-violet-700",
};

export const formatQaStatusLabel = (status: QaStatus): string =>
  QA_STATUS_LABELS[status] ?? status;

export const formatQaSourceLabel = (source: QaSource): string =>
  QA_SOURCE_LABELS[source] ?? source;

export const canRejectQaItem = (status: QaStatus): boolean =>
  status === "submitted";

export const canUnpublishQaItem = (status: QaStatus): boolean =>
  status === "published";

export const canPublishQaStatus = (status: QaStatus): boolean =>
  status === "draft" || status === "submitted";

export const QA_VISIBILITY_LABELS: Record<QaVisibility, string> = {
  public: "Public",
  private: "Private",
};

export const QA_VISIBILITY_STYLES: Record<QaVisibility, string> = {
  public: "bg-emerald-100 text-emerald-700",
  private: "bg-fuchsia-100 text-fuchsia-700",
};

export const formatQaVisibilityLabel = (visibility: QaVisibility): string =>
  QA_VISIBILITY_LABELS[visibility] ?? visibility;

export const getAskerDisplayName = (item: {
  askedByUser?: { name: string } | null;
  source?: QaSource;
}): string => {
  if (item.askedByUser?.name) return item.askedByUser.name;
  if (item.source === "user") return "Unknown user";
  return "—";
};

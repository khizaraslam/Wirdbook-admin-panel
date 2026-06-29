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

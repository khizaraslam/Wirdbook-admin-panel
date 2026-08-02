export type QaStatus = "draft" | "submitted" | "rejected" | "published";
export type QaSource = "admin" | "user";
export type QaVisibility = "public" | "private";
export type QaStatusFilter = QaStatus | "all";
export type QaSourceFilter = QaSource | "all";
export type QaVisibilityFilter = QaVisibility | "all";

export const QA_STATUS_TABS: { value: QaStatusFilter; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export const QA_SOURCE_OPTIONS: { value: QaSourceFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "user", label: "User submitted" },
  { value: "admin", label: "Admin created" },
];

export const QA_VISIBILITY_OPTIONS: {
  value: QaVisibilityFilter;
  label: string;
}[] = [
  { value: "all", label: "All visibility" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

export const QA_VISIBILITY_FORM_OPTIONS: {
  value: QaVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "public",
    label: "Public",
    description: "After publish, visible to all app users",
  },
  {
    value: "private",
    label: "Private",
    description: "After publish, only visible to the asker",
  },
];

import type {
  DhikrAssignmentStatus,
  DhikrClaimStatus,
} from "@/utils/helpers/models/communities/community.enums";

export const ASSIGNMENT_STATUS_STYLES: Record<
  DhikrAssignmentStatus,
  string
> = {
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  expired: "bg-gray-100 text-gray-600",
};

export const CLAIM_STATUS_STYLES: Record<DhikrClaimStatus, string> = {
  active: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  returned: "bg-gray-100 text-gray-600",
};

export const formatAssignmentStatus = (status: DhikrAssignmentStatus) =>
  status.replace(/_/g, " ");

export const formatAssignmentType = (type: string) =>
  type === "one_time" ? "One time" : "Weekly";

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
};

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
};

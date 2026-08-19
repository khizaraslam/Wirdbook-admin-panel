import type {
  DhikrAssignmentStatus,
  DhikrAssignmentType,
  DhikrClaimStatus,
} from "./community.enums";

export interface DhikrAssignmentDTO {
  id: string;
  dhikrTypeId: string;
  dhikrName?: string;
  assignmentType: DhikrAssignmentType;
  totalTarget: number;
  poolRemaining: number;
  claimedTotal: number;
  completedTotal: number;
  progressPercent: number;
  status: DhikrAssignmentStatus;
  expiresAt?: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  carriedOver?: number;
  createdAt: string;
}

export interface CreateDhikrAssignmentBody {
  dhikrTypeId: string;
  assignmentType: DhikrAssignmentType;
  targetQuantity: number;
  expiresAt?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface DhikrClaimReportDTO {
  userId?: string;
  userName: string;
  claimedQuantity: number;
  currentProgress: number;
  remaining: number;
  status: DhikrClaimStatus;
}

export interface DhikrReportDTO {
  assignmentId: string;
  dhikrName?: string;
  totalTarget: number;
  completedTotal: number;
  claims: DhikrClaimReportDTO[];
}

import type { CommunityStatus } from "./community.enums";

export interface CommunityDTO {
  id: string;
  name: string;
  status: CommunityStatus;
  memberCount: number;
  adminUserId: string | null;
  adminName: string | null;
  createdAt: string;
}

export interface CommunityMemberDTO {
  userId: string;
  name: string;
  role: "member" | "admin";
  joinedAt: string;
}

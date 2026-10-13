import type { CommunityStatus } from "./community.enums";

export interface CommunityDTO {
  id: string;
  name: string;
  status: CommunityStatus;
  memberCount: number;
  adminUserId: string | null;
  adminName: string | null;
  imageId: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface CommunityDetailDTO extends CommunityDTO {
  members: CommunityMemberDTO[];
}

export interface CommunityMemberDTO {
  userId: string;
  name: string;
  phone?: string | null;
  role: "member" | "admin";
  joinedAt: string;
}

export type NoticeboardPostCategory = "announcement" | "general";

export interface NoticeboardPostDTO {
  id: string;
  category: NoticeboardPostCategory;
  content: string | null;
  imageId: string | null;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNoticeboardPostPayload {
  category?: NoticeboardPostCategory;
  content?: string;
  image?: File | null;
  removeImage?: boolean;
}

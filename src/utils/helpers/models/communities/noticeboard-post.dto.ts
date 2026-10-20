export type NoticeboardPostCategory = "announcement" | "general";

export interface NoticeboardLikeDTO {
  userId: string;
  name: string;
  phone: string | null;
  createdAt: string;
}

export interface NoticeboardCommentDTO {
  id: string;
  authorId: string;
  authorName: string;
  authorPhone: string | null;
  content: string;
  createdAt: string;
  replies?: NoticeboardCommentDTO[];
}

export interface NoticeboardReportPostDTO extends NoticeboardPostDTO {
  authorPhone: string | null;
  likes: NoticeboardLikeDTO[];
  comments: NoticeboardCommentDTO[];
}

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

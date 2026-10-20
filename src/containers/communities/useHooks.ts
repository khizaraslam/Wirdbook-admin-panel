import { useCallback } from "react";
import {
  confirmationPopup,
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Communities_APIS } from "@/libs/apis/communities.api";
import type {
  CommunityDetailDTO,
  CommunityDTO,
  CommunityMemberDTO,
} from "@/utils/helpers/models/communities/community.dto";
import type {
  NoticeboardCommentListItemDTO,
  NoticeboardLikeDTO,
  NoticeboardReportItemDTO,
  NoticeboardPostDTO,
  NoticeboardReportPostDTO,
  UpdateNoticeboardPostPayload,
} from "@/utils/helpers/models/communities/noticeboard-post.dto";

interface ListPage<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CommunityFormPayload {
  name: string;
  image?: File | null;
  removeImage?: boolean;
}

const buildCommunityFormData = ({
  name,
  image,
  removeImage,
}: CommunityFormPayload): FormData => {
  const formData = new FormData();
  formData.append("name", name.trim());
  if (image) {
    formData.append("image", image);
  } else if (removeImage) {
    formData.append("image", "");
  }
  return formData;
};

const useCommunities = () => {
  const getAll = useCallback(async (): Promise<CommunityDTO[]> => {
    const response = await Communities_APIS.getAll();
    const { success = false, data = null } = response || {};
    if (success && Array.isArray(data)) return data as CommunityDTO[];
    return [];
  }, []);

  const getOne = useCallback(
    async (id: string): Promise<CommunityDetailDTO | null> => {
      const response = await Communities_APIS.getOne(id);
      const { success = false, data = null } = response || {};
      if (success && data) return data as CommunityDetailDTO;
      return null;
    },
    [],
  );

  const create = useCallback(async (payload: CommunityFormPayload) => {
    const response = await Communities_APIS.create(
      buildCommunityFormData(payload),
    );
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community created successfully");
      return true;
    }
    errorToaster(message || response?.error || "Failed to create community");
    return false;
  }, []);

  const update = useCallback(async (id: string, payload: CommunityFormPayload) => {
    const response = await Communities_APIS.update(
      id,
      buildCommunityFormData(payload),
    );
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community updated successfully");
      return true;
    }
    errorToaster(message || response?.error || "Failed to update community");
    return false;
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: "active" | "inactive") => {
      const response = await Communities_APIS.updateStatus(id, { status });
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(
          message ||
            `Community ${status === "active" ? "activated" : "deactivated"}`,
        );
        return true;
      }
      errorToaster(message || response?.error || "Failed to update status");
      return false;
    },
    [],
  );

  const assignAdmin = useCallback(async (id: string, userId: string) => {
    const response = await Communities_APIS.assignAdmin(id, { userId });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Community admin assigned successfully");
      return true;
    }
    if (response?.statusCode === 409) {
      errorToaster(
        message ||
          "User is already an active member of another community",
      );
      return false;
    }
    errorToaster(message || response?.error || "Failed to assign admin");
    return false;
  }, []);

  const getMembers = useCallback(
    async (id: string): Promise<CommunityMemberDTO[]> => {
      const response = await Communities_APIS.getMembers(id);
      const { success = false, data = null } = response || {};
      if (success && Array.isArray(data)) return data as CommunityMemberDTO[];
      return [];
    },
    [],
  );

  const emptyPage = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const getNoticeboardPostReports = useCallback(
    async (
      communityId: string,
      postId: string,
      page = 1,
    ): Promise<ListPage<NoticeboardReportItemDTO>> => {
      const response = await Communities_APIS.getNoticeboardPostReports(
        communityId,
        postId,
        page,
      );
      const { success = false, data = [], pagination = emptyPage } =
        response || {};
      if (!success) return { items: [], pagination: emptyPage };
      return {
        items: (Array.isArray(data) ? data : []) as NoticeboardReportItemDTO[],
        pagination,
      };
    },
    [],
  );

  const getNoticeboardLikes = useCallback(
    async (
      communityId: string,
      postId: string,
      page = 1,
    ): Promise<ListPage<NoticeboardLikeDTO>> => {
      const response = await Communities_APIS.getNoticeboardLikes(
        communityId,
        postId,
        page,
      );
      const { success = false, data = [], pagination = emptyPage } =
        response || {};
      if (!success) return { items: [], pagination: emptyPage };
      return {
        items: (Array.isArray(data) ? data : []) as NoticeboardLikeDTO[],
        pagination,
      };
    },
    [],
  );

  const getNoticeboardComments = useCallback(
    async (
      communityId: string,
      postId: string,
      page = 1,
    ): Promise<ListPage<NoticeboardCommentListItemDTO>> => {
      const response = await Communities_APIS.getNoticeboardComments(
        communityId,
        postId,
        page,
      );
      const { success = false, data = [], pagination = emptyPage } =
        response || {};
      if (!success) return { items: [], pagination: emptyPage };
      return {
        items: (Array.isArray(data)
          ? data
          : []) as NoticeboardCommentListItemDTO[],
        pagination,
      };
    },
    [],
  );

  const getNoticeboardReport = useCallback(
    async (communityId: string): Promise<NoticeboardReportPostDTO[]> => {
      const response = await Communities_APIS.getNoticeboardReport(communityId);
      const { success = false, data = null } = response || {};
      if (!success || !Array.isArray(data?.posts)) return [];
      return data.posts as NoticeboardReportPostDTO[];
    },
    [],
  );

  const getNoticeboardPosts = useCallback(
    async (
      communityId: string,
    ): Promise<NoticeboardPostDTO[]> => {
      const response = await Communities_APIS.getNoticeboardPosts(communityId, {
        page: 1,
        limit: 50,
      });
      const { success = false, data = null } = response || {};
      if (!success) return [];
      if (Array.isArray(data)) return data as NoticeboardPostDTO[];
      if (Array.isArray(data?.items)) return data.items as NoticeboardPostDTO[];
      return [];
    },
    [],
  );

  const updateNoticeboardPost = useCallback(
    async (
      communityId: string,
      postId: string,
      payload: UpdateNoticeboardPostPayload,
    ): Promise<NoticeboardPostDTO | null> => {
      const formData = new FormData();
      if (payload.category) formData.append("category", payload.category);
      if (payload.content !== undefined) {
        formData.append("content", payload.content);
      }
      if (payload.image) {
        formData.append("image", payload.image);
      } else if (payload.removeImage) {
        formData.append("image", "");
      }

      const response = await Communities_APIS.updateNoticeboardPost(
        communityId,
        postId,
        formData,
      );
      const { success = false, data = null, message = "" } = response || {};
      if (success && data) {
        successToaster(message || "Post updated successfully");
        return data as NoticeboardPostDTO;
      }
      errorToaster(message || response?.error || "Failed to update post");
      return null;
    },
    [],
  );

  const deleteNoticeboardPost = useCallback(
    async (communityId: string, postId: string) => {
      const confirmed = await confirmationPopup(
        "Delete noticeboard post?",
        "This will soft-delete the post and hide it from the member feed.",
      );
      if (!confirmed) return false;

      const response = await Communities_APIS.deleteNoticeboardPost(
        communityId,
        postId,
      );
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Post deleted successfully");
        return true;
      }
      errorToaster(message || response?.error || "Failed to delete post");
      return false;
    },
    [],
  );

  return {
    getAll,
    getOne,
    create,
    update,
    updateStatus,
    assignAdmin,
    getMembers,
    getNoticeboardPostReports,
    getNoticeboardLikes,
    getNoticeboardComments,
    getNoticeboardReport,
    getNoticeboardPosts,
    updateNoticeboardPost,
    deleteNoticeboardPost,
  };
};

export default useCommunities;

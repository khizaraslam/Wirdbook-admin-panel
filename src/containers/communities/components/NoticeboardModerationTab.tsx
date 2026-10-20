import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, UploadCloud, X, Pencil } from "lucide-react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import type {
  NoticeboardCommentListItemDTO,
  NoticeboardLikeDTO,
  NoticeboardPostCategory,
  NoticeboardPostDTO,
  NoticeboardReportItemDTO,
} from "@/utils/helpers/models/communities/noticeboard-post.dto";
import { getCommunityImageUrl } from "@/utils/helpers/communities/helpers";
import useCommunities from "../useHooks";

interface NoticeboardModerationTabProps {
  communityId: string;
}

type FormValues = {
  category: NoticeboardPostCategory;
  content: string;
  image: FileList | null;
};

const formatDate = (value: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
};

type ListKind = "likes" | "comments" | "reports";

interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const emptyMeta: PageMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const NoticeboardModerationTab: React.FC<NoticeboardModerationTabProps> = ({
  communityId,
}) => {
  const {
    getNoticeboardPosts,
    getNoticeboardLikes,
    getNoticeboardComments,
    getNoticeboardPostReports,
    updateNoticeboardPost,
    deleteNoticeboardPost,
  } = useCommunities();
  const [posts, setPosts] = useState<NoticeboardPostDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [listPost, setListPost] = useState<NoticeboardPostDTO | null>(null);
  const [listKind, setListKind] = useState<ListKind>("likes");
  const [likes, setLikes] = useState<NoticeboardLikeDTO[]>([]);
  const [comments, setComments] = useState<NoticeboardCommentListItemDTO[]>([]);
  const [reports, setReports] = useState<NoticeboardReportItemDTO[]>([]);
  const [listMeta, setListMeta] = useState<PageMeta>(emptyMeta);
  const [listLoading, setListLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<NoticeboardPostDTO | null>(
    null,
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      category: "general",
      content: "",
      image: null,
    },
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const items = await getNoticeboardPosts(communityId);
    setPosts(items);
    setLoading(false);
  }, [communityId, getNoticeboardPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const watchImage = watch("image");
  const previewUrl =
    watchImage && watchImage.length > 0
      ? URL.createObjectURL(watchImage[0])
      : "";

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openList = async (post: NoticeboardPostDTO, kind: ListKind, page = 1) => {
    setListPost(post);
    setListKind(kind);
    setListLoading(true);
    if (kind === "likes") {
      const result = await getNoticeboardLikes(communityId, post.id, page);
      setLikes(result.items);
      setComments([]);
      setReports([]);
      setListMeta(result.pagination);
    } else if (kind === "comments") {
      const result = await getNoticeboardComments(communityId, post.id, page);
      setComments(result.items);
      setLikes([]);
      setReports([]);
      setListMeta(result.pagination);
    } else {
      const result = await getNoticeboardPostReports(communityId, post.id, page);
      setReports(result.items);
      setLikes([]);
      setComments([]);
      setListMeta(result.pagination);
    }
    setListLoading(false);
  };

  const startEdit = (post: NoticeboardPostDTO) => {
    setEditingPost(post);
    setRemoveImage(false);
    reset({
      category: post.category,
      content: post.content ?? "",
      image: null,
    });
  };

  const onEditSubmit = async (data: FormValues) => {
    if (!editingPost) return;

    const newImage =
      data.image && data.image.length > 0 ? data.image[0] : undefined;
    const result = await updateNoticeboardPost(communityId, editingPost.id, {
      category: data.category,
      content: data.content,
      image: newImage,
      removeImage: removeImage && !newImage,
    });

    if (result) {
      setEditingPost(null);
      setRemoveImage(false);
      reset({ category: "general", content: "", image: null });
      await loadPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    setIsDeleting(true);
    const ok = await deleteNoticeboardPost(communityId, postId);
    setIsDeleting(false);
    if (ok) {
      if (editingPost?.id === postId) {
        setEditingPost(null);
        reset({ category: "general", content: "", image: null });
        setRemoveImage(false);
      }
      await loadPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
          Noticeboard report
        </h2>
        <p className="text-gray-400 text-sm font-medium mb-6">
          {loading
            ? "Loading posts..."
            : `${posts.length} posts. Open likes or comments from a post.`}
        </p>

        {posts.length === 0 && !loading ? (
          <p className="py-10 text-center text-gray-400">
            No noticeboard posts in this community yet.
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`flex gap-4 p-3 rounded-xl border ${
                  editingPost?.id === post.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-100"
                }`}
              >
                {post.imageUrl ? (
                  <img
                    src={getCommunityImageUrl(post.imageUrl)}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {post.authorName}
                    <span className="ml-2 text-xs font-medium capitalize text-gray-500">
                      {post.category}
                    </span>
                  </p>
                  {post.content && (
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(post.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => openList(post, "likes")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Likes ({post.likeCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => openList(post, "comments")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Comments ({post.commentCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => openList(post, "reports")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Reports
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="p-2 rounded-lg text-primary hover:bg-primary/10"
                    title="Edit post"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    title="Delete post"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingPost && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
            Edit post
          </h2>
          <p className="text-gray-400 text-sm font-medium mb-6">
            {editingPost.authorName} · {formatDate(editingPost.createdAt)}
          </p>

          <form
            onSubmit={handleSubmit(onEditSubmit)}
            noValidate
            className="space-y-4"
          >
            <div>
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-input"
                {...register("category")}
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <Textarea
              label="Content"
              placeholder="Post text"
              hint="Post must still have content and/or image after update"
              {...register("content")}
            />

            <div>
              <label className="form-label">Image</label>
              <p className="form-hint mb-2">
                Upload a new image to replace, or remove the current one
              </p>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Post preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image", null as unknown as FileList);
                      setRemoveImage(true);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : editingPost.imageUrl && !removeImage ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 mb-2">
                  <img
                    src={getCommunityImageUrl(editingPost.imageUrl)}
                    alt="Current"
                    className="w-full h-40 object-cover"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                  <UploadCloud size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload new image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image", {
                      onChange: () => setRemoveImage(false),
                    })}
                  />
                </label>
              )}

              {editingPost.imageUrl && !previewUrl && (
                <label className="inline-flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    Remove existing image
                  </span>
                </label>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingPost(null);
                  setRemoveImage(false);
                  reset({ category: "general", content: "", image: null });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <Modal
        isOpen={!!listPost}
        onClose={() => setListPost(null)}
        title={
          listKind === "likes"
            ? "Likes"
            : listKind === "comments"
              ? "Comments"
              : "Reports"
        }
        className="max-w-lg"
      >
        <p className="text-sm text-gray-500 mb-4">
          {listPost?.authorName}
          {listPost?.content ? ` · ${listPost.content}` : ""}
        </p>
        {listLoading ? (
          <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>
        ) : listKind === "likes" ? (
          likes.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No likes</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {likes.map((like) => (
                <li key={like.userId} className="py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {personLabel(like.name, like.phone)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(like.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : listKind === "comments" ? (
          comments.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No comments</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <li key={comment.id} className="py-3">
                <p className="text-sm font-medium text-gray-900">
                  {personLabel(comment.authorName, comment.authorPhone)}
                  {comment.parentCommentId ? (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      Reply
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )
        ) : reports.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No reports</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reports.map((report) => (
              <li key={report.id} className="py-3">
                <p className="text-sm font-medium text-gray-900">
                  {personLabel(report.reporterName, report.reporterPhone)}
                  <span className="ml-2 text-xs font-normal capitalize text-gray-400">
                    {report.status}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {report.reason || "No reason given"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(report.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
        {listMeta.totalPages > 1 && listPost ? (
          <Pagination
            meta={listMeta}
            onPageChange={(page) => openList(listPost, listKind, page)}
            className="mt-4"
          />
        ) : null}
      </Modal>
    </div>
  );
};

const personLabel = (name: string, phone: string | null) =>
  phone ? `${name} · ${phone}` : name;

export default NoticeboardModerationTab;

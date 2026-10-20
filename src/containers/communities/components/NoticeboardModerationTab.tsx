import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, UploadCloud, X, Pencil } from "lucide-react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import type {
  NoticeboardCommentDTO,
  NoticeboardPostCategory,
  NoticeboardPostDTO,
  NoticeboardReportPostDTO,
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

const NoticeboardModerationTab: React.FC<NoticeboardModerationTabProps> = ({
  communityId,
}) => {
  const { getNoticeboardReport, updateNoticeboardPost, deleteNoticeboardPost } =
    useCommunities();
  const [posts, setPosts] = useState<NoticeboardReportPostDTO[]>([]);
  const [loading, setLoading] = useState(false);
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
    const items = await getNoticeboardReport(communityId);
    setPosts(items);
    setLoading(false);
  }, [communityId, getNoticeboardReport]);

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
            : `${posts.length} posts, with likes and comments`}
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
                    {post.likeCount} likes · {post.commentCount} comments ·{" "}
                    {formatDate(post.createdAt)}
                  </p>
                  <PostEngagement post={post} />
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
    </div>
  );
};

const personLabel = (name: string, phone: string | null) =>
  phone ? `${name} · ${phone}` : name;

const CommentLine: React.FC<{ comment: NoticeboardCommentDTO; reply?: boolean }> = ({
  comment,
  reply = false,
}) => (
  <div className={reply ? "ml-4 mt-2 border-l border-gray-100 pl-3" : "mt-2"}>
    <p className="text-xs font-medium text-gray-800">
      {personLabel(comment.authorName, comment.authorPhone)}
    </p>
    <p className="text-sm text-gray-700">{comment.content}</p>
    <p className="text-[11px] text-gray-400">{formatDate(comment.createdAt)}</p>
    {comment.replies?.map((item) => (
      <CommentLine key={item.id} comment={item} reply />
    ))}
  </div>
);

const PostEngagement: React.FC<{ post: NoticeboardReportPostDTO }> = ({
  post,
}) => (
  <div className="mt-3 grid gap-3 sm:grid-cols-2">
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <p className="text-xs font-semibold text-gray-500">Likes</p>
      {post.likes.length === 0 ? (
        <p className="text-xs text-gray-400 mt-1">No likes</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {post.likes.map((like) => (
            <li key={like.userId} className="text-xs text-gray-700">
              {personLabel(like.name, like.phone)}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <p className="text-xs font-semibold text-gray-500">Comments</p>
      {post.comments.length === 0 ? (
        <p className="text-xs text-gray-400 mt-1">No comments</p>
      ) : (
        post.comments.map((comment) => (
          <CommentLine key={comment.id} comment={comment} />
        ))
      )}
    </div>
  </div>
);

export default NoticeboardModerationTab;

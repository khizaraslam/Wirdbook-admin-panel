import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, UploadCloud, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import type {
  NoticeboardPostCategory,
  NoticeboardPostDTO,
} from "@/utils/helpers/models/communities/noticeboard-post.dto";
import { getCommunityImageUrl } from "@/utils/helpers/communities/helpers";
import useCommunities from "../useHooks";

interface NoticeboardModerationTabProps {
  communityId: string;
}

type FormValues = {
  postId: string;
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
  const { updateNoticeboardPost, deleteNoticeboardPost } = useCommunities();
  const [lastUpdatedPost, setLastUpdatedPost] =
    useState<NoticeboardPostDTO | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      postId: "",
      category: "general",
      content: "",
      image: null,
    },
  });

  const watchImage = watch("image");
  const previewUrl =
    watchImage && watchImage.length > 0
      ? URL.createObjectURL(watchImage[0])
      : "";

  React.useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onEditSubmit = async (data: FormValues) => {
    const postId = data.postId.trim();
    if (!postId) return;

    const newImage =
      data.image && data.image.length > 0 ? data.image[0] : undefined;
    const result = await updateNoticeboardPost(communityId, postId, {
      category: data.category,
      content: data.content,
      image: newImage,
      removeImage: removeImage && !newImage,
    });

    if (result) {
      setLastUpdatedPost(result);
      setRemoveImage(false);
      setValue("image", null as unknown as FileList);
    }
  };

  const handleDelete = async () => {
    const postId = watch("postId").trim();
    if (!postId) return;

    setIsDeleting(true);
    const ok = await deleteNoticeboardPost(communityId, postId);
    setIsDeleting(false);

    if (ok) {
      setLastUpdatedPost(null);
      reset({
        postId: "",
        category: "general",
        content: "",
        image: null,
      });
      setRemoveImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900">
        There is no admin list-posts API yet. Enter a known post UUID from
        reports or app data to edit or delete it.
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
          Moderate post
        </h2>
        <p className="text-gray-400 text-sm font-medium mb-6">
          Edit or soft-delete any noticeboard post in this community
        </p>

        <form onSubmit={handleSubmit(onEditSubmit)} noValidate className="space-y-4">
          <Input
            label="Post ID *"
            placeholder="Post UUID"
            hint="Required for edit and delete"
            error={errors.postId?.message}
            {...register("postId", { required: "Post ID is required" })}
          />

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
            placeholder="Post text (send empty to clear)"
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

            {!previewUrl && (
              <label className="inline-flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Remove existing image</span>
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
              className="!text-red-600 !border-red-200 hover:!bg-red-50"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              <Trash2 size={16} className="mr-2" />
              Delete post
            </Button>
          </div>
        </form>
      </div>

      {lastUpdatedPost && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Last updated post
          </h3>
          <div className="flex gap-4">
            {lastUpdatedPost.imageUrl && (
              <img
                src={getCommunityImageUrl(lastUpdatedPost.imageUrl)}
                alt="Post"
                className="w-24 h-24 rounded-lg object-cover border border-gray-100 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-mono mb-1">
                {lastUpdatedPost.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">{lastUpdatedPost.authorName}</span>
                {" · "}
                <span className="capitalize">{lastUpdatedPost.category}</span>
              </p>
              {lastUpdatedPost.content && (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {lastUpdatedPost.content}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {lastUpdatedPost.likeCount} likes ·{" "}
                {lastUpdatedPost.commentCount} comments · Updated{" "}
                {formatDate(lastUpdatedPost.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeboardModerationTab;

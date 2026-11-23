import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/utils/helpers/common/http-methods";

export interface StoryText {
  arabic: string;
  english: string;
}

export interface StorySummary {
  story_id: number;
  story_name: StoryText;
  story_image: string | null;
  story_image_id: string | null;
  published: boolean;
}

export interface StoryDetail extends StorySummary {
  moral: StoryText;
  segments: (StoryText & {
    index: number;
    segment_image: string | null;
    segment_image_id: string | null;
  })[];
}

export interface StoryPayload {
  story_name: StoryText;
  story_image_id: string | null;
  published: boolean;
  moral: StoryText;
  segments: (StoryText & { segment_image_id: string | null })[];
}

interface StoryPage {
  items: StorySummary[];
  page: number;
  limit: number;
  total: number;
}

interface ImageMedia {
  id: string;
  url: string;
}

interface ApiResult<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { message?: string }[];
}

async function readData<T>(
  request: Promise<ApiResult<T>>,
  fallback: string,
): Promise<T> {
  const result = await request;
  if (!result?.success || result.data === undefined) {
    throw new Error(
      result?.errors?.[0]?.message ||
        result?.message ||
        result?.error ||
        fallback,
    );
  }
  return result.data;
}

const endpoint = "/api/admin/islamic-stories";

export const IslamicStoriesApi = {
  list: (page: number, limit: number) =>
    readData<StoryPage>(
      getRequest(endpoint, { page, limit }),
      "Could not load stories.",
    ),
  get: (id: number) =>
    readData<StoryDetail>(
      getRequest(`${endpoint}/${id}`),
      "Could not load this story.",
    ),
  save: (id: number | undefined, body: StoryPayload) =>
    readData<StoryDetail>(
      id === undefined
        ? postRequest(endpoint, body)
        : patchRequest(`${endpoint}/${id}`, body),
      "Could not save this story.",
    ),
  remove: (id: number) =>
    readData<null>(
      deleteRequest(`${endpoint}/${id}`),
      "Could not delete this story.",
    ),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return readData<ImageMedia>(
      postRequest("/api/admin/media/upload", form, { type: "image" }),
      "Could not upload the image.",
    );
  },
};

export function storyImageUrl(url: string | null): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.VITE_BASE_URL_PREFIX || "").replace(/\/$/, "");
  return `${base}/${url.replace(/^\//, "")}`;
}

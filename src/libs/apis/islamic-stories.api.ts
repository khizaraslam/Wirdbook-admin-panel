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

type StoryOrderEntry = Omit<StorySummary, "story_image" | "story_image_id"> &
  Partial<Pick<StorySummary, "story_image" | "story_image_id">>;

interface StoryPage {
  items: StorySummary[];
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
  async listOrder(): Promise<StorySummary[]> {
    const ordered = await readData<StoryOrderEntry[]>(
      getRequest(`${endpoint}/order`),
      "Could not load the story order.",
    );

    const missing = new Set(
      ordered
        .filter((story) => story.story_image === undefined)
        .map((story) => story.story_id),
    );
    const covers = new Map<number, StorySummary>();
    for (let page = 1; missing.size; page++) {
      const result = await readData<StoryPage>(
        getRequest(endpoint, { page, limit: 100 }),
        "Could not load story covers.",
      );
      for (const story of result.items) {
        if (missing.delete(story.story_id)) covers.set(story.story_id, story);
      }
      if (page * result.limit >= result.total) break;
    }

    return ordered.map((story) => {
      const cover = covers.get(story.story_id);
      return {
        ...story,
        story_image: story.story_image ?? cover?.story_image ?? null,
        story_image_id: story.story_image_id ?? cover?.story_image_id ?? null,
      };
    });
  },
  reorder: (storyIds: number[], expectedIds: number[]) =>
    readData<null>(
      patchRequest(`${endpoint}/order`, { storyIds, expectedIds }),
      "Could not save the story order.",
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

import type { BookDTO } from "@/utils/helpers/models/books/book.dto";

const MAX_BOOK_BYTES = 50 * 1024 * 1024;

export const formatBookSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatBookDate = (value: string): string => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString();
};

export const getBookPublicUrl = (book: BookDTO): string => {
  const host = (import.meta.env.VITE_BASE_URL_PREFIX || "").replace(/\/$/, "");
  const rawPath = book.url?.startsWith("http")
    ? book.url
    : book.url?.startsWith("/")
      ? `${host}${book.url}`
      : `${host}/uploads/books/content/${book.filename}`;

  try {
    const parsed = new URL(rawPath);
    const segments = parsed.pathname.split("/");
    const name = segments.pop() || book.filename;
    parsed.pathname = `${segments.join("/")}/${encodeURIComponent(name)}`;
    return parsed.toString();
  } catch {
    return rawPath;
  }
};

export const normalizeBookFilename = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase().endsWith(".json") ? trimmed : `${trimmed}.json`;
};

export const validateBookJsonFile = async (
  file: File | null,
): Promise<string | null> => {
  if (!file) return "Please select a .json file";
  if (!file.name.toLowerCase().endsWith(".json")) {
    return "Please select a .json file";
  }
  if (file.size > MAX_BOOK_BYTES) {
    return "File must be 50MB or smaller";
  }
  try {
    JSON.parse(await file.text());
  } catch {
    return "Selected file is not valid JSON";
  }
  return null;
};

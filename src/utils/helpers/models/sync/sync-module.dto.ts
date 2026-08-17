export interface SyncModuleDTO {
  id: string;
  name: string;
  sync_time: string | null;
  content_path?: string;
}

export const UPLOADABLE_SYNC_MODULES = new Set([
  "books",
  "blessed_wird",
  "prayer_wird",
  "qasidas",
  "salawat_majlis",
  "quran_translation",
]);

export const supportsJsonUpload = (moduleName: string) =>
  UPLOADABLE_SYNC_MODULES.has(moduleName);

export const SYNC_MODULE_LABELS: Record<string, string> = {
  books: "Books",
  blessed_wird: "Blessed Wird",
  prayer_wird: "Prayer Wird",
  qasidas: "Qasidas",
  salawat_majlis: "Salawat Majlis",
  quran_translation: "Quran Translation",
  banner: "Banner",
  events: "Events",
  tafseer: "Tafseer",
};

export const SYNC_MODULE_FILENAME_HINTS: Partial<Record<string, string>> = {
  quran_translation: "quran_ayah_wise.json",
};

/** Default public content paths when API list omits content_path */
export const SYNC_MODULE_CONTENT_PATHS: Partial<Record<string, string>> = {
  quran_translation: "uploads/quran/content/quran_ayah_wise.json",
};

export const getSyncModuleLabel = (name: string): string =>
  SYNC_MODULE_LABELS[name] ??
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getSyncModuleFilenameHint = (name: string): string | null =>
  SYNC_MODULE_FILENAME_HINTS[name] ?? null;

export const getSyncContentUrl = (contentPath: string): string => {
  if (!contentPath) return "";
  if (contentPath.startsWith("http")) return contentPath;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`;
  return `${base}${path}`;
};

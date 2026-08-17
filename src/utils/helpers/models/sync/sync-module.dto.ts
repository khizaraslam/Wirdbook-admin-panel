export interface SyncModuleDTO {
  id: string;
  name: string;
  sync_time: string | null;
  has_content?: boolean;
  content_path?: string | null;
  download_url?: string | null;
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

export const canDownloadSyncModule = (module: SyncModuleDTO) =>
  supportsJsonUpload(module.name) &&
  Boolean(module.has_content ?? module.download_url ?? module.content_path);

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

export const getSyncModuleLabel = (name: string): string =>
  SYNC_MODULE_LABELS[name] ??
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

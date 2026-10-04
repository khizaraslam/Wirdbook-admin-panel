export interface SyncModuleDTO {
  id: string;
  name: string;
  sync_time: string | null;
  has_content?: boolean;
  content_path?: string | null;
  download_url?: string | null;
}

export const UPLOADABLE_SYNC_MODULES = new Set([
  "blessed_wird",
  "prayer_wird",
  "qasidas",
  "salawat_majlis",
  "quran_translation",
  "user_manual",
]);

export const supportsJsonUpload = (moduleName: string) =>
  UPLOADABLE_SYNC_MODULES.has(moduleName);

export const canDownloadSyncModule = (module: SyncModuleDTO) =>
  supportsJsonUpload(module.name) &&
  Boolean(module.has_content ?? module.download_url ?? module.content_path);

export const SYNC_MODULE_LABELS: Record<string, string> = {
  blessed_wird: "Blessed Wird",
  prayer_wird: "Prayer Wird",
  qasidas: "Qasidas",
  salawat_majlis: "Salawat Majlis",
  quran_translation: "Quran Translation",
  user_manual: "User Manual",
  banner: "Banner",
  events: "Events",
  tafseer: "Tafseer",
};

export const SYNC_MODULE_CONTENT_PATHS: Record<string, string> = {
  blessed_wird: "uploads/blessed_wird/content/blessed_wird_data_source.json",
  prayer_wird: "uploads/prayer_wird/content/prayer_data_source.json",
  qasidas: "uploads/qasidas/content/qasida.json",
  salawat_majlis: "uploads/salawat_majlis/content/salawat_majlis_data_source.json",
  quran_translation: "uploads/quran/content/quran_ayah_wise.json",
  user_manual: "uploads/manaul/content/user_manual.json",
};

export const getSyncModuleLabel = (name: string): string =>
  SYNC_MODULE_LABELS[name] ??
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getSyncModuleContentPath = (name: string): string | undefined =>
  SYNC_MODULE_CONTENT_PATHS[name];

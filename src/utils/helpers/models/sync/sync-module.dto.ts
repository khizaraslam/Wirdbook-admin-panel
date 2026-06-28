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
]);

export const supportsJsonUpload = (moduleName: string) =>
  UPLOADABLE_SYNC_MODULES.has(moduleName);


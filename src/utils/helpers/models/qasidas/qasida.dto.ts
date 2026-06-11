export interface LocalizedText {
  en: string | null;
  ar: string | null;
}

export interface QasidaWird {
  id: string;
  description: { en: string; ar: string };
  transliteration: string | null;
  repetition: number;
  isTitle: boolean;
  indexOrder: number;
}

export interface Qasida {
  id: string;
  title: { en: string; ar: string };
  author: LocalizedText;
  mode: LocalizedText;
  type: LocalizedText;
  singer: LocalizedText;
  info: LocalizedText;
  audioUrl: string | null;
  audioDuration: number | null;
  totalWirds: number;
  isEnabled: boolean;
  indexOrder: number;
  wirds?: QasidaWird[];
  createdAt: string;
  updatedAt: string;
}

export interface QasidaSettings {
  title: { en: string; ar: string };
  info: LocalizedText;
  totalQasidas: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QasidaListFilters {
  page: number;
  limit: number;
  search: string;
}

export interface WirdFormBody {
  descriptionAr?: string;
  descriptionEn?: string;
  transliteration?: string | null;
  repetition?: number;
  isTitle?: boolean;
  indexOrder?: number;
}

export interface BulkWirdsUploadResult {
  created: number;
  replaced: boolean;
  totalWirds: number;
}

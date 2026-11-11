export interface BannerTitle {
  ar_text: string;
  en_text: string;
}

/** `banner` and `general` = image + title. `text` = title + optional surah. `shaykhimage` = Shaykh image. */
export type BannerType = "text" | "banner" | "general" | "shaykhimage";

export const BANNER_TYPE_OPTIONS: { value: BannerType; label: string }[] = [
  { value: "banner", label: "Banner — image + title" },
  { value: "text", label: "Text — title + surah (+ optional image)" },
  { value: "general", label: "General" },
  { value: "shaykhimage", label: "Shaykh Image" },
];

export const bannerTypeLabel = (type: BannerType) =>
  BANNER_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;

export interface BannerDTO {
  id: string;
  type: BannerType;
  enabled: boolean;
  image: string | null;
  title: BannerTitle;
  surah_name: BannerTitle | null;
  surah_reference: BannerTitle | null;
  indexOrder: number;
}

/** Normalize admin/public API item. Legacy rows may omit type/enabled. For `banner`, surah is always null in UI. */
export const normalizeBanner = (raw: {
  id: string;
  type?: BannerType;
  enabled?: boolean;
  image?: string | null;
  title?: Partial<BannerTitle>;
  surah_name?: BannerTitle | null;
  surah_reference?: BannerTitle | null;
  indexOrder?: number;
}): BannerDTO => {
  const type: BannerType =
    raw.type === "text" ||
    raw.type === "banner" ||
    raw.type === "general" ||
    raw.type === "shaykhimage"
      ? raw.type
      : "banner";
  return {
    id: raw.id,
    type,
    enabled: raw.enabled !== false,
    image: raw.image ?? null,
    title: {
      ar_text: raw.title?.ar_text ?? "",
      en_text: raw.title?.en_text ?? "",
    },
    surah_name: type === "text" ? raw.surah_name ?? null : null,
    surah_reference: type === "text" ? raw.surah_reference ?? null : null,
    indexOrder: raw.indexOrder ?? 0,
  };
};

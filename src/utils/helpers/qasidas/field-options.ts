export interface LocalizedOption {
  en: string;
  ar: string;
}

/** Fixed maqam / mode list for admin qasida form. */
export const QASIDA_MODE_OPTIONS: LocalizedOption[] = [
  { en: "Ajam", ar: "عجم" },
  { en: "Bayat", ar: "بيات" },
  { en: "Hijaz", ar: "حجاز" },
  { en: "Jiharkah", ar: "جهاركا" },
  { en: "Nahawand", ar: "نهاوند" },
  { en: "Rast", ar: "رست" },
  { en: "Saba", ar: "صبا" },
  { en: "Sikah", ar: "سيكاه" },
];

/** Fixed type list for admin qasida form. */
export const QASIDA_TYPE_OPTIONS: LocalizedOption[] = [
  { en: "General", ar: "عام" },
  { en: "Hadrah-Qiyam", ar: "حضرة قيام" },
  { en: "Hadrah-Ruku'", ar: "حضرة ركوع" },
  { en: "Hadrah-Ifrad", ar: "حضرة إفراد" },
  { en: "Mawlid", ar: "مولد" },
];

export const optionKey = (opt: { en?: string | null; ar?: string | null }) =>
  `${opt.en ?? ""}\0${opt.ar ?? ""}`;

/** Collapse track labels like "Name 1" or "Bayat Qiyam (Name)" to the vocalist. */
export const canonicalizeVocalistName = (
  value: string | null | undefined,
): string => {
  let s = (value || "").trim();
  if (!s) return "";
  const paren = s.match(/\(([^)]+)\)\s*$/);
  if (paren?.[1]?.trim()) s = paren[1].trim();
  s = s.replace(/[\s_\-#]*\d+$/u, "").trim();
  return s.replace(/[-_]+/g, " ").replace(/\s+/g, " ");
};

export const uniqueVocalists = (
  items: Array<{ en: string | null; ar: string | null }>,
): Array<{ en: string | null; ar: string | null }> => {
  const seen = new Map<string, { en: string | null; ar: string | null }>();
  for (const item of items) {
    const en = canonicalizeVocalistName(item.en) || null;
    const ar = canonicalizeVocalistName(item.ar) || null;
    const key = (en || ar || "").toLowerCase();
    if (!key) continue;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, { en, ar });
      continue;
    }
    seen.set(key, {
      en: existing.en || en,
      ar: existing.ar || ar,
    });
  }
  return [...seen.values()];
};

export const findOptionByKey = (
  options: LocalizedOption[],
  en: string,
  ar: string,
): LocalizedOption | undefined =>
  options.find((o) => o.en === en && o.ar === ar) ??
  options.find((o) => o.en === en) ??
  options.find((o) => o.ar === ar);

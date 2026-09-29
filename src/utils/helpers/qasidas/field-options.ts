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

export const findOptionByKey = (
  options: LocalizedOption[],
  en: string,
  ar: string,
): LocalizedOption | undefined =>
  options.find((o) => o.en === en && o.ar === ar) ??
  options.find((o) => o.en === en) ??
  options.find((o) => o.ar === ar);

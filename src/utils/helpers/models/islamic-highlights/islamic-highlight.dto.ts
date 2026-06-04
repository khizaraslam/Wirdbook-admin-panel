export type IslamicHighlightMessageType = "verse" | "hadith" | "wisdom";
export type IslamicHighlightScheduleMode = "default" | "weekly" | "hijri";

export interface BilingualText {
  ar: string;
  en: string;
}

export interface IslamicHighlightSchedule {
  mode: IslamicHighlightScheduleMode;
  hijriMonth: number | null;
  hijriDay: number | null;
  dayOfWeek: number | null;
}

export interface IslamicHighlightDTO {
  id: string;
  messageType: IslamicHighlightMessageType;
  message: BilingualText;
  source: BilingualText;
  schedule: IslamicHighlightSchedule;
  audioUrl: string | null;
  imageUrl: string | null;
  enabled: boolean;
  indexOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const normalizeIslamicHighlight = (
  raw: Partial<IslamicHighlightDTO> & {
    isEnabled?: boolean;
    messageAr?: string;
    messageEn?: string;
    sourceAr?: string;
    sourceEn?: string;
  },
): IslamicHighlightDTO => {
  const message =
    raw.message ??
    ({
      ar: raw.messageAr ?? "",
      en: raw.messageEn ?? "",
    } as BilingualText);

  const source =
    raw.source ??
    ({
      ar: raw.sourceAr ?? "",
      en: raw.sourceEn ?? "",
    } as BilingualText);

  const schedule: IslamicHighlightSchedule = raw.schedule ?? {
    mode: "default",
    hijriMonth: null,
    hijriDay: null,
    dayOfWeek: null,
  };

  return {
    id: raw.id ?? "",
    messageType: (raw.messageType as IslamicHighlightMessageType) ?? "verse",
    message: { ar: message.ar ?? "", en: message.en ?? "" },
    source: {
      ar: source.ar ?? "",
      en: source.en ?? "",
    },
    schedule: {
      mode: schedule.mode ?? "default",
      hijriMonth: schedule.hijriMonth ?? null,
      hijriDay: schedule.hijriDay ?? null,
      dayOfWeek: schedule.dayOfWeek ?? null,
    },
    audioUrl: raw.audioUrl ?? null,
    imageUrl: raw.imageUrl ?? null,
    enabled: raw.enabled ?? raw.isEnabled ?? true,
    indexOrder: raw.indexOrder ?? 0,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
};

export type IslamicHighlightMessageType = "verse" | "hadith" | "wisdom";
export type IslamicHighlightTimeSlot = "whole_day" | "morning" | "evening";
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
  daysOfWeek: number[] | null;
}

export interface IslamicHighlightDTO {
  id: string;
  messageType: IslamicHighlightMessageType;
  timeSlot: IslamicHighlightTimeSlot;
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

const normalizeTimeSlot = (
  value: unknown,
): IslamicHighlightTimeSlot => {
  const slot = String(value ?? "").toLowerCase();
  if (slot === "whole_day" || slot === "whole-day" || slot === "wholeday") {
    return "whole_day";
  }
  if (slot === "evening" || slot === "pm") return "evening";
  if (slot === "morning" || slot === "am") return "morning";
  return "whole_day";
};

export const normalizeIslamicHighlight = (
  raw: Partial<IslamicHighlightDTO> & {
    isEnabled?: boolean;
    messageAr?: string;
    messageEn?: string;
    sourceAr?: string;
    sourceEn?: string;
    time_slot?: string;
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
    daysOfWeek: null,
  };

  const daysOfWeek = Array.isArray(schedule.daysOfWeek)
    ? schedule.daysOfWeek.filter((day) => Number.isInteger(day))
    : null;

  return {
    id: raw.id ?? "",
    messageType: (raw.messageType as IslamicHighlightMessageType) ?? "verse",
    timeSlot: normalizeTimeSlot(raw.timeSlot ?? raw.time_slot),
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
      daysOfWeek: daysOfWeek?.length ? daysOfWeek : null,
    },
    audioUrl: raw.audioUrl ?? null,
    imageUrl: raw.imageUrl ?? null,
    enabled: raw.enabled ?? raw.isEnabled ?? true,
    indexOrder: raw.indexOrder ?? 0,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
};

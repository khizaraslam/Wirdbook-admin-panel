import type {
  IslamicHighlightDTO,
  IslamicHighlightScheduleMode,
  IslamicHighlightTimeSlot,
} from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";

export const TIME_SLOT_OPTIONS = [
  { value: "morning" as const, label: "Morning (AM)", labelAr: "الصباح" },
  { value: "evening" as const, label: "Evening (PM)", labelAr: "المساء" },
];

export const MESSAGE_TYPE_OPTIONS = [
  { value: "verse", label: "Verse" },
  { value: "hadith", label: "Hadith" },
  { value: "wisdom", label: "Wisdom" },
] as const;

export const SCHEDULE_MODE_OPTIONS = [
  { value: "default", label: "Always (default)" },
  { value: "weekly", label: "Day of week" },
  { value: "hijri", label: "Hijri date" },
] as const;

export const DAY_OF_WEEK_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const HIJRI_MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Month ${i + 1}`,
}));

export const getMediaUrl = (url: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
};

export const formatTimeSlotLabel = (
  timeSlot: IslamicHighlightTimeSlot,
): string => {
  const option = TIME_SLOT_OPTIONS.find((o) => o.value === timeSlot);
  return option?.label ?? timeSlot;
};

export const formatScheduleLabel = (
  schedule: IslamicHighlightDTO["schedule"],
): string => {
  if (schedule.mode === "weekly" && schedule.dayOfWeek !== null) {
    const day = DAY_OF_WEEK_OPTIONS.find((d) => d.value === schedule.dayOfWeek);
    return `Weekly · ${day?.label ?? schedule.dayOfWeek}`;
  }
  if (
    schedule.mode === "hijri" &&
    schedule.hijriMonth != null &&
    schedule.hijriDay != null
  ) {
    return `Hijri · ${schedule.hijriDay}/${schedule.hijriMonth}`;
  }
  return "Always (default)";
};

export interface HighlightFormValues {
  timeSlot: IslamicHighlightTimeSlot;
  messageType: string;
  messageAr: string;
  messageEn: string;
  sourceAr: string;
  sourceEn: string;
  scheduleMode: IslamicHighlightScheduleMode;
  dayOfWeek: string;
  hijriMonth: string;
  hijriDay: string;
  isEnabled: boolean;
  indexOrder: number;
}

export const appendHighlightFormData = (
  formData: FormData,
  values: HighlightFormValues,
  files?: {
    audio?: File | null;
    image?: File | null;
    removeAudio?: boolean;
    removeImage?: boolean;
  },
) => {
  formData.append("timeSlot", values.timeSlot);
  formData.append("messageType", values.messageType);
  formData.append("messageAr", values.messageAr.trim());
  formData.append("messageEn", values.messageEn.trim());
  if (values.sourceAr.trim()) formData.append("sourceAr", values.sourceAr.trim());
  if (values.sourceEn.trim()) formData.append("sourceEn", values.sourceEn.trim());

  formData.append("scheduleMode", values.scheduleMode);
  if (values.scheduleMode === "weekly" && values.dayOfWeek !== "") {
    formData.append("dayOfWeek", values.dayOfWeek);
  }
  if (values.scheduleMode === "hijri") {
    if (values.hijriMonth) formData.append("hijriMonth", values.hijriMonth);
    if (values.hijriDay) formData.append("hijriDay", values.hijriDay);
  }

  formData.append("isEnabled", values.isEnabled ? "true" : "false");
  formData.append("indexOrder", String(values.indexOrder));

  if (files?.removeAudio) formData.append("audio", "null");
  else if (files?.audio) formData.append("audio", files.audio);

  if (files?.removeImage) formData.append("image", "null");
  else if (files?.image) formData.append("image", files.image);
};

export const buildShareText = (item: IslamicHighlightDTO): string => {
  const lines = [
    item.message.en,
    item.message.ar,
    item.source.en ? `— ${item.source.en}` : "",
    item.source.ar ? `— ${item.source.ar}` : "",
  ].filter(Boolean);
  return lines.join("\n\n");
};

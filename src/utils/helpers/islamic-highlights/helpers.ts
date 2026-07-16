import type {
  IslamicHighlightDTO,
  IslamicHighlightScheduleMode,
  IslamicHighlightTimeSlot,
} from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";

export const HIGHLIGHT_TIME_SLOTS = [
  { value: "whole_day" as const, labelEn: "Whole day", labelAr: "طوال اليوم" },
  { value: "morning" as const, labelEn: "Morning (AM)", labelAr: "الصباح" },
  { value: "evening" as const, labelEn: "Evening (PM)", labelAr: "المساء" },
] as const;

/** @deprecated Use HIGHLIGHT_TIME_SLOTS — kept for existing imports */
export const TIME_SLOT_OPTIONS = HIGHLIGHT_TIME_SLOTS.map((slot) => ({
  value: slot.value,
  label: slot.labelEn,
  labelAr: slot.labelAr,
}));

export const HIGHLIGHT_MESSAGE_TYPES = [
  { value: "verse", labelEn: "Verse", labelAr: "آية" },
  { value: "hadith", labelEn: "Hadith", labelAr: "حديث" },
  { value: "wisdom", labelEn: "Wisdom", labelAr: "حكمة" },
] as const;

export const MESSAGE_TYPE_OPTIONS = HIGHLIGHT_MESSAGE_TYPES.map((type) => ({
  value: type.value,
  label: type.labelEn,
}));

export const HIGHLIGHT_SCHEDULE_MODES = [
  { value: "default", labelEn: "Every day", labelAr: "كل يوم" },
  { value: "weekly", labelEn: "Weekly", labelAr: "أسبوعي" },
  { value: "hijri", labelEn: "Hijri date", labelAr: "تاريخ هجري" },
] as const;

export const SCHEDULE_MODE_OPTIONS = HIGHLIGHT_SCHEDULE_MODES.map((mode) => ({
  value: mode.value,
  label: mode.labelEn,
}));

export const DAYS_OF_WEEK = [
  { value: 0, labelEn: "Sunday", labelAr: "الأحد" },
  { value: 1, labelEn: "Monday", labelAr: "الإثنين" },
  { value: 2, labelEn: "Tuesday", labelAr: "الثلاثاء" },
  { value: 3, labelEn: "Wednesday", labelAr: "الأربعاء" },
  { value: 4, labelEn: "Thursday", labelAr: "الخميس" },
  { value: 5, labelEn: "Friday", labelAr: "الجمعة" },
  { value: 6, labelEn: "Saturday", labelAr: "السبت" },
] as const;

export const DAY_OF_WEEK_OPTIONS = DAYS_OF_WEEK.map((day) => ({
  value: day.value,
  label: day.labelEn,
}));

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
  return "Every day";
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
  formData.append("timeSlot", values.timeSlot || "whole_day");
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

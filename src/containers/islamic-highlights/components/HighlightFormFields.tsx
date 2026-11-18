import React, { useEffect } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  TIME_SLOT_OPTIONS,
  MESSAGE_TYPE_OPTIONS,
  SCHEDULE_MODE_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  HIJRI_MONTHS,
} from "@/utils/helpers/islamic-highlights/helpers";
import type {
  HighlightFormValues,
  HighlightTagMutationResult,
} from "@/utils/helpers/islamic-highlights/helpers";
import type { IslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight-tag.dto";
import type { CreateIslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/create-islamic-highlight-tag.dto";
import InlineCreateHighlightTag from "./InlineCreateHighlightTag";

export interface HighlightFormInputs extends HighlightFormValues {
  audio: FileList | null;
  image: FileList | null;
}

interface HighlightFormFieldsProps {
  register: UseFormRegister<HighlightFormInputs>;
  errors: FieldErrors<HighlightFormInputs>;
  watch: UseFormWatch<HighlightFormInputs>;
  setValue: UseFormSetValue<HighlightFormInputs>;
  showOrder?: boolean;
  tags: IslamicHighlightTagDTO[];
  createTag: (
    body: CreateIslamicHighlightTagDTO,
  ) => Promise<HighlightTagMutationResult>;
  onTagsRefresh: () => Promise<IslamicHighlightTagDTO[]>;
  audioSection?: React.ReactNode;
  imageSection?: React.ReactNode;
}

const HighlightFormFields: React.FC<HighlightFormFieldsProps> = ({
  register,
  errors,
  watch,
  setValue,
  showOrder = true,
  tags,
  createTag,
  onTagsRefresh,
  audioSection,
  imageSection,
}) => {
  const scheduleMode = watch("scheduleMode");
  const selectedDays = watch("daysOfWeek") ?? [];
  const selectedHijriDays = watch("hijriDays") ?? [];

  useEffect(() => {
    register("daysOfWeek", {
      validate: (value) =>
        scheduleMode !== "weekly" ||
        (Array.isArray(value) && value.length > 0) ||
        "Select at least one day",
    });
    register("hijriDays", {
      validate: (value) =>
        scheduleMode !== "hijri" ||
        (Array.isArray(value) && value.length > 0) ||
        "Select at least one Hijri day",
    });
  }, [register, scheduleMode]);

  const toggleDay = (day: number) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((value) => value !== day)
      : [...selectedDays, day].sort((a, b) => a - b);
    setValue("daysOfWeek", next, { shouldValidate: true, shouldDirty: true });
  };

  const toggleHijriDay = (day: number) => {
    const next = selectedHijriDays.includes(day)
      ? selectedHijriDays.filter((value) => value !== day)
      : [...selectedHijriDays, day].sort((a, b) => a - b);
    setValue("hijriDays", next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-100 bg-slate-50/50 p-4 space-y-4">
        <p className="text-sm font-semibold text-gray-900">Schedule</p>
        <div className="flex flex-col gap-1.5">
          <label className="form-label">Schedule mode *</label>
          <select className="form-input" {...register("scheduleMode")}>
            {SCHEDULE_MODE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {scheduleMode === "weekly" && (
          <div className="flex flex-col gap-1.5">
            <label className="form-label">Days of week *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAY_OF_WEEK_OPTIONS.map((day) => {
                const checked = selectedDays.includes(day.value);
                return (
                  <label
                    key={day.value}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                      checked
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={checked}
                      onChange={() => toggleDay(day.value)}
                    />
                    {day.label}
                  </label>
                );
              })}
            </div>
            {errors.daysOfWeek && (
              <p className="text-[11px] text-red-500">
                {errors.daysOfWeek.message}
              </p>
            )}
          </div>
        )}

        {scheduleMode === "hijri" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Hijri month</label>
              <select className="form-input" {...register("hijriMonth")}>
                <option value="">Every month</option>
                {HIJRI_MONTHS.map((m) => (
                  <option key={m.value} value={String(m.value)}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500">
                Every month repeats the selected days in each lunar month. Pick a
                name to limit it to that month.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Hijri days *</label>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => {
                  const checked = selectedHijriDays.includes(day);
                  return (
                    <label
                      key={day}
                      className={`flex items-center justify-center rounded-lg border px-2 py-2 text-sm cursor-pointer ${
                        checked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleHijriDay(day)}
                      />
                      {day}
                    </label>
                  );
                })}
              </div>
              {errors.hijriDays && (
                <p className="text-[11px] text-red-500">
                  {errors.hijriDays.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
          <label className="form-label">Time slot *</label>
          <select
            className="form-input"
            {...register("timeSlot", { required: "Time slot is required" })}
          >
            {TIME_SLOT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} — {o.labelAr}
              </option>
            ))}
          </select>
          {errors.timeSlot && (
            <p className="text-[11px] text-red-500">{errors.timeSlot.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="form-label">Tag</label>
        <select className="form-input" {...register("tagId")}>
          <option value="">No tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.labelEn}
              {tag.labelAr ? ` / ${tag.labelAr}` : ""}
            </option>
          ))}
        </select>
        <InlineCreateHighlightTag
          createTag={createTag}
          onCreated={async (tag) => {
            const refreshed = await onTagsRefresh();
            const selectedId =
              tag.id ||
              refreshed.find(
                (item) => item.slug === tag.slug || item.labelEn === tag.labelEn,
              )?.id ||
              "";
            if (selectedId) {
              setValue("tagId", selectedId, { shouldDirty: true });
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="form-label">Message type *</label>
        <select className="form-input" {...register("messageType", { required: true })}>
          {MESSAGE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="highlight-enabled"
          type="checkbox"
          className="rounded border-gray-300 text-primary focus:ring-primary"
          {...register("isEnabled")}
        />
        <label htmlFor="highlight-enabled" className="form-label mb-0">
          Enabled (visible on public list when scheduled)
        </label>
      </div>

      {showOrder && (
        <Input
          label="Display order"
          type="number"
          error={errors.indexOrder?.message}
          {...register("indexOrder", { valueAsNumber: true, min: 0 })}
        />
      )}

      <Textarea
        label="Message (Arabic) *"
        dir="rtl"
        error={errors.messageAr?.message}
        {...register("messageAr", { required: "Arabic message is required" })}
      />
      <Textarea
        label="Message (English) *"
        error={errors.messageEn?.message}
        {...register("messageEn", { required: "English message is required" })}
      />

      <Input label="Source (Arabic)" dir="rtl" {...register("sourceAr")} />
      <Input label="Source (English)" {...register("sourceEn")} />

      {audioSection}
      {imageSection}
    </div>
  );
};

export default HighlightFormFields;

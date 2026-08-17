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
import type { HighlightFormValues } from "@/utils/helpers/islamic-highlights/helpers";

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
  audioSection?: React.ReactNode;
  imageSection?: React.ReactNode;
}

const HighlightFormFields: React.FC<HighlightFormFieldsProps> = ({
  register,
  errors,
  watch,
  setValue,
  showOrder = true,
  audioSection,
  imageSection,
}) => {
  const scheduleMode = watch("scheduleMode");
  const selectedDays = watch("daysOfWeek") ?? [];

  useEffect(() => {
    register("daysOfWeek", {
      validate: (value) =>
        scheduleMode !== "weekly" ||
        (Array.isArray(value) && value.length > 0) ||
        "Select at least one day",
    });
  }, [register, scheduleMode]);

  const toggleDay = (day: number) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((value) => value !== day)
      : [...selectedDays, day].sort((a, b) => a - b);
    setValue("daysOfWeek", next, { shouldValidate: true, shouldDirty: true });
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Hijri month *</label>
              <select
                className="form-input"
                {...register("hijriMonth", {
                  required: scheduleMode === "hijri" ? "Required" : false,
                })}
              >
                <option value="">Month</option>
                {HIJRI_MONTHS.map((m) => (
                  <option key={m.value} value={String(m.value)}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Hijri day *"
              type="number"
              min={1}
              max={30}
              error={errors.hijriDay?.message}
              {...register("hijriDay", {
                required: scheduleMode === "hijri" ? "Required" : false,
                min: { value: 1, message: "1–30" },
                max: { value: 30, message: "1–30" },
              })}
            />
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

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
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
  showOrder?: boolean;
  audioSection?: React.ReactNode;
  imageSection?: React.ReactNode;
}

const HighlightFormFields: React.FC<HighlightFormFieldsProps> = ({
  register,
  errors,
  watch,
  showOrder = true,
  audioSection,
  imageSection,
}) => {
  const scheduleMode = watch("scheduleMode");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
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
            <label className="form-label">Day of week *</label>
            <select
              className="form-input"
              {...register("dayOfWeek", {
                required: scheduleMode === "weekly" ? "Select a day" : false,
              })}
            >
              <option value="">Select day</option>
              {DAY_OF_WEEK_OPTIONS.map((d) => (
                <option key={d.value} value={String(d.value)}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.dayOfWeek && (
              <p className="text-[11px] text-red-500">{errors.dayOfWeek.message}</p>
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
      </div>

      {audioSection}
      {imageSection}
    </div>
  );
};

export default HighlightFormFields;

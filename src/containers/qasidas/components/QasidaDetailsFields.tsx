import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Input from "@/components/ui/Input";
import { UploadCloud, X, Music } from "lucide-react";
import { getQasidaAudioUrl } from "@/utils/helpers/qasidas/helpers";

export interface QasidaFormValues {
  titleEn: string;
  titleAr: string;
  authorEn: string;
  authorAr: string;
  modeEn: string;
  modeAr: string;
  typeEn: string;
  typeAr: string;
  singerEn: string;
  singerAr: string;
  infoEn: string;
  infoAr: string;
  audioDuration: string;
  isEnabled: boolean;
  indexOrder: string;
  audio: FileList | null;
}

interface QasidaDetailsFieldsProps {
  register: UseFormRegister<QasidaFormValues>;
  errors: FieldErrors<QasidaFormValues>;
  watchAudio: FileList | null | undefined;
  onClearAudio: () => void;
  currentAudioUrl?: string | null;
  removeCurrentAudio?: boolean;
  onRemoveCurrentAudio?: () => void;
}

export const buildQasidaFormData = (
  data: QasidaFormValues,
  options?: { removeAudio?: boolean; includeEmpty?: boolean },
) => {
  const formData = new FormData();
  formData.append("titleEn", data.titleEn.trim());
  formData.append("titleAr", data.titleAr.trim());

  const optionalFields: [string, string][] = [
    ["authorEn", data.authorEn],
    ["authorAr", data.authorAr],
    ["modeEn", data.modeEn],
    ["modeAr", data.modeAr],
    ["typeEn", data.typeEn],
    ["typeAr", data.typeAr],
    ["singerEn", data.singerEn],
    ["singerAr", data.singerAr],
    ["infoEn", data.infoEn],
    ["infoAr", data.infoAr],
  ];

  optionalFields.forEach(([key, value]) => {
    const trimmed = value?.trim() ?? "";
    if (trimmed || options?.includeEmpty) {
      formData.append(key, trimmed);
    }
  });

  if (data.audioDuration?.trim()) {
    formData.append("audioDuration", data.audioDuration.trim());
  }
  if (data.indexOrder?.trim()) {
    formData.append("indexOrder", data.indexOrder.trim());
  }
  formData.append("isEnabled", data.isEnabled ? "true" : "false");

  if (options?.removeAudio) {
    formData.append("audio", "");
  } else if (data.audio && data.audio.length > 0) {
    formData.append("audio", data.audio[0]);
  }

  return formData;
};

const QasidaDetailsFields: React.FC<QasidaDetailsFieldsProps> = ({
  register,
  errors,
  watchAudio,
  onClearAudio,
  currentAudioUrl,
  removeCurrentAudio,
  onRemoveCurrentAudio,
}) => {
  const previewUrl =
    !removeCurrentAudio && currentAudioUrl
      ? getQasidaAudioUrl(currentAudioUrl)
      : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title (English) *"
          error={errors.titleEn?.message}
          {...register("titleEn", { required: "Title (English) is required" })}
        />
        <Input
          label="Title (Arabic) *"
          className="text-right"
          dir="rtl"
          error={errors.titleAr?.message}
          {...register("titleAr", { required: "Title (Arabic) is required" })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Author (English)" {...register("authorEn")} />
        <Input
          label="Author (Arabic)"
          className="text-right"
          dir="rtl"
          {...register("authorAr")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Mode (English)" placeholder="e.g., Bayat" {...register("modeEn")} />
        <Input
          label="Mode (Arabic)"
          placeholder="e.g., بيات"
          className="text-right"
          dir="rtl"
          {...register("modeAr")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Type (English)" {...register("typeEn")} />
        <Input
          label="Type (Arabic)"
          className="text-right"
          dir="rtl"
          {...register("typeAr")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Singer (English)" {...register("singerEn")} />
        <Input
          label="Singer (Arabic)"
          className="text-right"
          dir="rtl"
          {...register("singerAr")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="form-label text-sm font-bold text-gray-900">
            Info (English)
          </label>
          <textarea
            className="form-input min-h-[100px] resize-y"
            {...register("infoEn")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="form-label text-sm font-bold text-gray-900">
            Info (Arabic)
          </label>
          <textarea
            className="form-input min-h-[100px] resize-y text-right"
            dir="rtl"
            {...register("infoAr")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Audio duration (ms)"
          type="number"
          placeholder="e.g., 3368000"
          {...register("audioDuration")}
        />
        <Input
          label="Index order"
          type="number"
          min={0}
          {...register("indexOrder")}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="qasida-enabled"
          type="checkbox"
          className="rounded border-gray-300 text-primary focus:ring-primary"
          {...register("isEnabled")}
        />
        <label htmlFor="qasida-enabled" className="form-label mb-0">
          Visible on public list (enabled)
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="form-label text-sm font-bold text-gray-900">
          Audio (MP3, max 200MB)
        </label>
        {previewUrl ? (
          <div className="mb-2 space-y-2">
            <audio controls src={previewUrl} className="w-full max-w-md" />
            {onRemoveCurrentAudio ? (
              <button
                type="button"
                onClick={onRemoveCurrentAudio}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove current audio
              </button>
            ) : null}
          </div>
        ) : null}
        {!watchAudio || watchAudio.length === 0 ? (
          <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors min-h-[80px]">
            <span className="text-gray-400 text-sm">Upload MP3</span>
            <UploadCloud className="w-5 h-5 text-gray-400" />
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,.mp3"
              className="hidden"
              {...register("audio")}
            />
          </label>
        ) : (
          <div className="form-input flex items-center justify-between py-2 bg-gray-50 border-gray-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <Music className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {watchAudio[0].name}
              </span>
            </div>
            <button
              type="button"
              onClick={onClearAudio}
              className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QasidaDetailsFields;

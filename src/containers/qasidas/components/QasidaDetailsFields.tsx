import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import Input from "@/components/ui/Input";
import ReciterAudiosEditor, {
  ReciterAudioDraft,
} from "./ReciterAudiosEditor";
import SuggestPairInput from "./SuggestPairInput";
import LocalizedSelect from "./LocalizedSelect";
import useQasidas from "../useHooks";
import type { LocalizedText } from "@/utils/helpers/models/qasidas/qasida.dto";
import {
  QASIDA_MODE_OPTIONS,
  QASIDA_TYPE_OPTIONS,
} from "@/utils/helpers/qasidas/field-options";

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
  isEnabled: boolean;
  indexOrder: string;
}

interface QasidaDetailsFieldsProps {
  register: UseFormRegister<QasidaFormValues>;
  errors: FieldErrors<QasidaFormValues>;
  setValue: UseFormSetValue<QasidaFormValues>;
  watch: UseFormWatch<QasidaFormValues>;
  reciters: ReciterAudioDraft[];
  onRecitersChange: (items: ReciterAudioDraft[]) => void;
}

export const buildQasidaFormData = (
  data: QasidaFormValues,
  reciters: ReciterAudioDraft[],
  options?: { includeEmpty?: boolean },
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

  if (data.indexOrder?.trim()) {
    formData.append("indexOrder", data.indexOrder.trim());
  }
  formData.append("isEnabled", data.isEnabled ? "true" : "false");

  const packed = reciters
    .map((item) => ({
      reciter_name: item.reciter_name.trim(),
      audio_link: item.audio_link.trim(),
      audio_duration: Number(item.audio_duration) || 0,
      audio_key: item.audio_key.trim(),
      file: item.file,
    }))
    .filter((item) => item.reciter_name || item.audio_link || item.file);

  formData.append(
    "audios",
    JSON.stringify(
      packed.map(({ file: _file, ...rest }) => rest),
    ),
  );

  packed.forEach((item, index) => {
    if (item.file) {
      formData.append(`reciterAudio_${index}`, item.file);
    }
  });

  return formData;
};

const QasidaDetailsFields: React.FC<QasidaDetailsFieldsProps> = ({
  register,
  errors,
  setValue,
  watch,
  reciters,
  onRecitersChange,
}) => {
  const { getFieldOptions } = useQasidas();
  const [authors, setAuthors] = useState<LocalizedText[]>([]);
  const [singers, setSingers] = useState<LocalizedText[]>([]);

  const authorEn = watch("authorEn");
  const authorAr = watch("authorAr");
  const modeEn = watch("modeEn");
  const modeAr = watch("modeAr");
  const typeEn = watch("typeEn");
  const typeAr = watch("typeAr");
  const singerEn = watch("singerEn");
  const singerAr = watch("singerAr");

  useEffect(() => {
    let cancelled = false;
    getFieldOptions().then((opts) => {
      if (cancelled) return;
      setAuthors(opts.authors || []);
      setSingers(opts.singers || []);
    });
    return () => {
      cancelled = true;
    };
  }, [getFieldOptions]);

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
        <SuggestPairInput
          label="Author (English)"
          lang="en"
          value={authorEn || ""}
          options={authors}
          placeholder="Type to search or add new"
          hint="Pick an existing author or type a new name"
          onChange={(v) => setValue("authorEn", v, { shouldDirty: true })}
          onSelectPair={(pair) => {
            setValue("authorEn", pair.en || "", { shouldDirty: true });
            setValue("authorAr", pair.ar || "", { shouldDirty: true });
          }}
        />
        <SuggestPairInput
          label="Author (Arabic)"
          lang="ar"
          value={authorAr || ""}
          options={authors}
          placeholder="اكتب للبحث أو أضف جديداً"
          className="text-right"
          dir="rtl"
          onChange={(v) => setValue("authorAr", v, { shouldDirty: true })}
          onSelectPair={(pair) => {
            setValue("authorEn", pair.en || "", { shouldDirty: true });
            setValue("authorAr", pair.ar || "", { shouldDirty: true });
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LocalizedSelect
          label="Mode"
          options={QASIDA_MODE_OPTIONS}
          en={modeEn || ""}
          ar={modeAr || ""}
          placeholder="Select mode"
          onChange={(opt) => {
            setValue("modeEn", opt?.en || "", { shouldDirty: true });
            setValue("modeAr", opt?.ar || "", { shouldDirty: true });
          }}
        />
        <LocalizedSelect
          label="Type"
          options={QASIDA_TYPE_OPTIONS}
          en={typeEn || ""}
          ar={typeAr || ""}
          placeholder="Select type"
          onChange={(opt) => {
            setValue("typeEn", opt?.en || "", { shouldDirty: true });
            setValue("typeAr", opt?.ar || "", { shouldDirty: true });
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SuggestPairInput
          label="Singer (English)"
          lang="en"
          value={singerEn || ""}
          options={singers}
          placeholder="Type to search or add new"
          hint="Pick an existing singer when available"
          onChange={(v) => setValue("singerEn", v, { shouldDirty: true })}
          onSelectPair={(pair) => {
            setValue("singerEn", pair.en || "", { shouldDirty: true });
            setValue("singerAr", pair.ar || "", { shouldDirty: true });
          }}
        />
        <SuggestPairInput
          label="Singer (Arabic)"
          lang="ar"
          value={singerAr || ""}
          options={singers}
          placeholder="اكتب للبحث أو أضف جديداً"
          className="text-right"
          dir="rtl"
          onChange={(v) => setValue("singerAr", v, { shouldDirty: true })}
          onSelectPair={(pair) => {
            setValue("singerEn", pair.en || "", { shouldDirty: true });
            setValue("singerAr", pair.ar || "", { shouldDirty: true });
          }}
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

      <ReciterAudiosEditor items={reciters} onChange={onRecitersChange} />
    </div>
  );
};

export default QasidaDetailsFields;

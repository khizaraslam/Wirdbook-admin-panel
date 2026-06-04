import React from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { UploadCloud, X, ImageIcon, Music } from "lucide-react";
import type { HighlightFormInputs } from "./HighlightFormFields";

interface FileUploadFieldProps {
  label: string;
  field: "audio" | "image";
  accept: string;
  hint: string;
  register: UseFormRegister<HighlightFormInputs>;
  watch: UseFormWatch<HighlightFormInputs>;
  setValue: UseFormSetValue<HighlightFormInputs>;
  currentUrl?: string | null;
  onRemoveCurrent?: () => void;
  showCurrent?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  field,
  accept,
  hint,
  register,
  watch,
  setValue,
  currentUrl,
  onRemoveCurrent,
  showCurrent = false,
}) => {
  const files = watch(field);
  const Icon = field === "audio" ? Music : ImageIcon;

  const handleClear = () => {
    setValue(field, null as unknown as FileList);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="form-label text-sm font-bold text-gray-900">{label}</label>
      {showCurrent && currentUrl && !files?.length && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 mb-2">
          <span className="text-xs text-gray-600 truncate flex-1">
            Current file attached
          </span>
          {onRemoveCurrent && (
            <button
              type="button"
              onClick={onRemoveCurrent}
              className="text-xs text-red-600 hover:underline shrink-0 ml-2"
            >
              Remove
            </button>
          )}
        </div>
      )}
      {!files || files.length === 0 ? (
        <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 min-h-[80px]">
          <span className="text-gray-400 text-sm">{hint}</span>
          <UploadCloud className="w-5 h-5 text-gray-400" />
          <input type="file" accept={accept} className="hidden" {...register(field)} />
        </label>
      ) : (
        <div className="form-input flex items-center justify-between py-2 bg-gray-50">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate">
              {files[0].name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;

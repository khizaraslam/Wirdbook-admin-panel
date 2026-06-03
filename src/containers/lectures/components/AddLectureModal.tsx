import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import {
  formatDateForDateTimeLocal,
  formatDateTimeLocalForBackend,
} from "@/utils/helpers/common/common";
import { UploadCloud, X, FileAudio, FileText } from "lucide-react";

interface AddLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  tabs: TabsDTO[];
}

export interface LectureFormInputs {
  title: string;
  dateTime: string;
  tabId: string;
  audio: FileList;
  pdf: FileList;
}

const AddLectureModal: React.FC<AddLectureModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  tabs,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<LectureFormInputs>({
    defaultValues: {
      title: "",
      dateTime: formatDateForDateTimeLocal(new Date()),
      tabId: tabs[0]?.id || "",
    },
    mode: "onChange",
  });

  const watchAudio = watch("audio");
  const watchPdf = watch("pdf");

  const handleClearFile = (fieldName: "audio" | "pdf") => {
    reset({ ...getValues(), [fieldName]: null } as any);
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = (data: LectureFormInputs) => {
    const formData = new FormData();
    formData.append("title", data.title);

    // Format dateTime to match backend expectations (e.g. 2026-02-26T07:00:24+0000)
    const dateTime = formatDateTimeLocalForBackend(data.dateTime);
    formData.append("dateTime", dateTime);

    if (data.tabId) {
      formData.append("tabId", data.tabId);
    }

    if (data.audio && data.audio.length > 0) {
      formData.append("audio", data.audio[0]);
    }

    if (data.pdf && data.pdf.length > 0) {
      formData.append("pdf", data.pdf[0]);
    }

    onAdd(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lecture"
      className=""
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">
            Fill in the details for the new lecture
          </p>

          <Input
            label="Lecture Title *"
            placeholder="e.g., Introduction to Shamael"
            error={errors.title?.message}
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Audio File *
            </label>
            {!watchAudio || watchAudio.length === 0 ? (
              <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors">
                <span className="text-gray-400 text-sm">Upload audio</span>
                <UploadCloud className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  {...register("audio", { required: "Audio file is required" })}
                />
              </label>
            ) : (
              <div className="form-input flex items-center justify-between py-2 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileAudio className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {watchAudio[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleClearFile("audio")}
                  className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {errors.audio && (
              <p className="text-xs text-red-500 mt-1">
                {errors.audio.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              PDF File *
            </label>
            {!watchPdf || watchPdf.length === 0 ? (
              <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors">
                <span className="text-gray-400 text-sm">Upload PDF</span>
                <UploadCloud className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  {...register("pdf", { required: "PDF file is required" })}
                />
              </label>
            ) : (
              <div className="form-input flex items-center justify-between py-2 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {watchPdf[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleClearFile("pdf")}
                  className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {errors.pdf && (
              <p className="text-xs text-red-500 mt-1">{errors.pdf.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Date and Time *
            </label>
            <input
              type="datetime-local"
              {...register("dateTime", {
                required: "Date and Time is required",
              })}
              className="form-input cursor-pointer"
            />
            {errors.dateTime && (
              <p className="text-xs text-red-500 mt-1">
                {errors.dateTime.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Category / Tab *
            </label>
            <select
              className="form-input cursor-pointer"
              {...register("tabId", { required: "Please select a tab" })}
            >
              <option value="" disabled>
                Select a category
              </option>
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid}
              className="rounded-md px-5 py-2.5 h-[46px] btn-primary"
            >
              Add Lecture
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddLectureModal;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LecturesDTO } from "@/utils/helpers/models/lectures/lectures.dto";
import { TabsDTO } from "@/utils/helpers/models/tabs/tabs.dto";
import type { ContentType } from "@/utils/helpers/enums/content-type.enum";
import {
  formatDateForDateTimeLocal,
  formatDateTimeLocalForBackend,
  getFileNameFromUrl,
} from "@/utils/helpers/common/common";
import { UploadCloud, X, FileAudio, FileText } from "lucide-react";

interface EditLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: FormData) => void;
  lecture: LecturesDTO | null;
  tabs: TabsDTO[];
  contentType: ContentType;
}

interface EditLectureFormInputs {
  title: string;
  dateTime: string;
  tabId: string;
  audio: FileList;
  pdf: FileList;
}

const EditLectureModal: React.FC<EditLectureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lecture,
  tabs,
  contentType,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<EditLectureFormInputs>({
    mode: "onChange",
  });

  const watchAudio = watch("audio");
  const watchPdf = watch("pdf");

  const handleClearFile = (fieldName: "audio" | "pdf") => {
    reset({ ...getValues(), [fieldName]: null } as any);
  };

  useEffect(() => {
    if (lecture && isOpen) {
      const dt = lecture.dateTime ? new Date(lecture.dateTime) : new Date();
      reset({
        title: lecture.title,
        dateTime: formatDateForDateTimeLocal(lecture.dateTime ?? undefined),
        tabId: lecture.tabId || "",
      });
    }
  }, [lecture, isOpen, reset]);

  const onSubmit = (data: EditLectureFormInputs) => {
    if (lecture) {
      const formData = new FormData();
      formData.append("title", data.title);

      // Format dateTime to match backend expectations (e.g. 2026-02-26T07:00:24+0000)
      const dateTime = formatDateTimeLocalForBackend(data.dateTime);
      formData.append("dateTime", dateTime);
      formData.append("type", contentType);

      if (data.tabId) {
        formData.append("tabId", data.tabId);
      }

      if (data.audio && data.audio.length > 0) {
        formData.append("audio", data.audio[0]);
      }

      if (data.pdf && data.pdf.length > 0) {
        formData.append("pdf", data.pdf[0]);
      }

      onSave(lecture.id, formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lecture" className="">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <p className="text-sm text-muted -mt-3">Update the lecture details</p>

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
              lecture?.audioUrl ? (
                <div className="form-input flex items-center justify-between py-2 bg-blue-50/30 border-blue-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileAudio className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                        Current File
                      </span>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {getFileNameFromUrl(lecture.audioUrl)}
                      </span>
                    </div>
                  </div>
                  <label className="text-[11px] font-bold text-primary hover:underline cursor-pointer bg-white px-2 py-1 rounded-md border border-primary/20 shadow-sm">
                    Replace
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      {...register("audio")}
                    />
                  </label>
                </div>
              ) : (
                <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400 text-sm">
                    Upload new audio
                  </span>
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    {...register("audio", {
                      validate: (value) =>
                        (value && value.length > 0) ||
                        !!lecture?.audioUrl ||
                        "Audio file is required",
                    })}
                  />
                </label>
              )
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
              lecture?.pdfUrl ? (
                <div className="form-input flex items-center justify-between py-2 bg-red-50/30 border-red-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-5 h-5 text-red-500 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                        Current File
                      </span>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {getFileNameFromUrl(lecture.pdfUrl)}
                      </span>
                    </div>
                  </div>
                  <label className="text-[11px] font-bold text-primary hover:underline cursor-pointer bg-white px-2 py-1 rounded-md border border-primary/20 shadow-sm">
                    Replace
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      {...register("pdf", {
                        validate: (value) =>
                          (value && value.length > 0) ||
                          !!lecture?.pdfUrl ||
                          "PDF file is required",
                      })}
                    />
                  </label>
                </div>
              ) : (
                <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400 text-sm">Upload new PDF</span>
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    {...register("pdf", {
                      validate: (value) =>
                        (value && value.length > 0) ||
                        !!lecture?.pdfUrl ||
                        "PDF file is required",
                    })}
                  />
                </label>
              )
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
              className="w-full h-[51px] px-3 rounded-lg border border-gray-300 outline-none focus:border-primary transition-colors"
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
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditLectureModal;

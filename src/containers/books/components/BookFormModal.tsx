import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { BookDTO } from "@/utils/helpers/models/books/book.dto";
import {
  normalizeBookFilename,
  validateBookJsonFile,
} from "@/utils/helpers/books/helpers";

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, filename?: string) => Promise<boolean>;
  initial?: BookDTO | null;
}

type FormValues = {
  filename: string;
  file: FileList;
};

const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initial = null,
}) => {
  const isUpdate = !!initial;
  const [fileError, setFileError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { filename: "" },
  });

  useEffect(() => {
    if (isOpen) {
      setFileError("");
      reset({ filename: initial?.filename ?? "" });
    }
  }, [isOpen, initial, reset]);

  const submit = async (data: FormValues) => {
    const file = data.file?.[0] ?? null;
    const validationError = await validateBookJsonFile(file);
    if (validationError || !file) {
      setFileError(validationError || "Please select a .json file");
      return;
    }

    const filename = isUpdate
      ? initial?.filename
      : normalizeBookFilename(data.filename);

    const ok = await onSubmit(file, filename || undefined);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Update book" : "Add book"}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="space-y-4">
          {isUpdate ? (
            <div>
              <p className="form-label">Filename</p>
              <p className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 break-all">
                {initial?.filename}
              </p>
            </div>
          ) : (
            <Input
              label="Filename"
              hint="Optional. Leave empty to use the uploaded file name."
              placeholder="durrah-ghazalian-ar.json"
              error={errors.filename?.message}
              {...register("filename")}
            />
          )}
          <Input
            label="JSON file *"
            type="file"
            accept=".json,application/json"
            error={fileError}
            {...register("file", {
              onChange: () => setFileError(""),
            })}
          />
          <p className="text-xs text-gray-400">
            JSON only, max 50MB. Same name replaces the existing book.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isUpdate ? "Replace file" : "Upload book"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookFormModal;

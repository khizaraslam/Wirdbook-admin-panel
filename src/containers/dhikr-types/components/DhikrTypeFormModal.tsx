import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";

interface DhikrTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<boolean>;
  initial?: DhikrTypeDTO | null;
  title: string;
  submitLabel: string;
}

export type FormValues = {
  name: string;
  nameAr: string;
  description: string;
  sortOrder: number;
  status: "active" | "inactive";
  defaultCount: number;
};

const DhikrTypeFormModal: React.FC<DhikrTypeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initial = null,
  title,
  submitLabel,
}) => {
  const isEdit = !!initial;
  const isKhitma = initial?.kind === "khitma";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      sortOrder: 0,
      status: "active",
      defaultCount: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initial?.name ?? "",
        nameAr: initial?.nameAr ?? "",
        description: initial?.description ?? "",
        sortOrder: initial?.sortOrder ?? 0,
        status: initial?.status ?? "active",
        defaultCount:
          initial?.kind === "khitma" ? 30 : (initial?.defaultCount ?? 0),
      });
    }
  }, [isOpen, initial, reset]);

  const submit = async (data: FormValues) => {
    const ok = await onSubmit({
      ...data,
      name: data.name.trim(),
      nameAr: data.nameAr.trim(),
      description: data.description.trim(),
      sortOrder: Number(data.sortOrder) || 0,
      defaultCount: isKhitma ? 30 : Math.max(0, Number(data.defaultCount) || 0),
    });
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="space-y-4">
          <Input
            label="Name (English) *"
            placeholder="SubhanAllah"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Name (Arabic) *"
            placeholder="سبحان الله"
            dir="rtl"
            error={errors.nameAr?.message}
            {...register("nameAr", { required: "Arabic name is required" })}
          />
          <Input
            label="Description"
            placeholder="Optional description"
            {...register("description")}
          />
          <Input
            label="Default count"
            type="number"
            min={0}
            disabled={isKhitma}
            hint={
              isKhitma
                ? "Khitma is always 30 juz."
                : "Example: Surat Yaseen 41, Surat Ikhlas 70,000, La Ilaha Illa Allah 70,000."
            }
            {...register("defaultCount", {
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or more" },
            })}
          />
          <Input
            label="Sort order"
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DhikrTypeFormModal;

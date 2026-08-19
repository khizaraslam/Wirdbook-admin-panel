import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
  initialName?: string;
  title: string;
  submitLabel: string;
}

type FormValues = { name: string };

const CommunityFormModal: React.FC<CommunityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  title,
  submitLabel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: initialName } });

  React.useEffect(() => {
    if (isOpen) reset({ name: initialName });
  }, [isOpen, initialName, reset]);

  const submit = async (data: FormValues) => {
    const ok = await onSubmit(data.name.trim());
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <Input
          label="Community name *"
          placeholder="e.g. Cape Town"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
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

export default CommunityFormModal;

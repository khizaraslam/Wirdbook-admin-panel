import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => Promise<boolean>;
  communityName: string;
}

type FormValues = { userId: string };

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  communityName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) reset({ userId: "" });
  }, [isOpen, reset]);

  const submit = async (data: FormValues) => {
    const ok = await onSubmit(data.userId.trim());
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign admin — ${communityName}`}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <p className="text-sm text-muted mb-4">
          Enter the app user UUID. The user will get admin role in this
          community. If they are active in another community, assignment will
          fail with 409.
        </p>
        <Input
          label="App user UUID *"
          placeholder="uuid"
          error={errors.userId?.message}
          {...register("userId", { required: "User ID is required" })}
        />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Assign admin
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignAdminModal;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";
import type { DhikrAssignmentType } from "@/utils/helpers/models/communities/community.enums";
import type { CreateDhikrAssignmentBody } from "@/utils/helpers/models/communities/dhikr-assignment.dto";

interface CreateDhikrTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: CreateDhikrAssignmentBody) => Promise<boolean>;
  dhikrTypes: DhikrTypeDTO[];
}

type FormValues = {
  dhikrTypeId: string;
  assignmentType: DhikrAssignmentType;
  targetQuantity: number;
  expiresAt: string;
  periodStart: string;
  periodEnd: string;
};

const CreateDhikrTaskModal: React.FC<CreateDhikrTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dhikrTypes,
}) => {
  const activeTypes = dhikrTypes.filter((t) => t.status === "active");
  const firstActiveTypeId = activeTypes[0]?.id ?? "";
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      dhikrTypeId: "",
      assignmentType: "one_time",
      targetQuantity: 10000,
      expiresAt: "",
      periodStart: "",
      periodEnd: "",
    },
  });

  const assignmentType = watch("assignmentType");
  const periodStart = watch("periodStart");
  const isWeekly = assignmentType === "weekly";

  useEffect(() => {
    if (isOpen) {
      reset({
        dhikrTypeId: firstActiveTypeId,
        assignmentType: "one_time",
        targetQuantity: 10000,
        expiresAt: "",
        periodStart: "",
        periodEnd: "",
      });
    }
  }, [isOpen, firstActiveTypeId, reset]);

  const submit = async (data: FormValues) => {
    if (activeTypes.length === 0) {
      setError("dhikrTypeId", {
        type: "manual",
        message: "Create an active dhikr type first",
      });
      return;
    }

    if (data.assignmentType === "one_time") {
      if (!data.expiresAt) {
        setError("expiresAt", {
          type: "manual",
          message: "Expiry date/time is required for one-time assignment",
        });
        return;
      }
      clearErrors("expiresAt");
    }

    if (data.assignmentType === "weekly") {
      if (!data.periodStart || !data.periodEnd) {
        return;
      }
      if (new Date(data.periodEnd) < new Date(data.periodStart)) {
        setError("periodEnd", {
          type: "manual",
          message: "Week end must be on or after week start",
        });
        return;
      }
      clearErrors("periodEnd");
    }

    const body: CreateDhikrAssignmentBody = {
      dhikrTypeId: data.dhikrTypeId,
      assignmentType: data.assignmentType,
      targetQuantity: Number(data.targetQuantity),
    };
    if (data.assignmentType === "one_time") {
      body.expiresAt = new Date(data.expiresAt).toISOString();
    }
    if (data.assignmentType === "weekly") {
      body.periodStart = data.periodStart;
      body.periodEnd = data.periodEnd;
    }
    const ok = await onSubmit(body);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create community dhikr task"
      className="max-w-lg"
    >
      <p className="text-sm text-gray-500 mb-4">
        Sets a community pool target. Members take portions themselves in the
        mobile app — nothing is auto-assigned.
      </p>
      {activeTypes.length === 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-sm text-amber-800">
            No active dhikr types found. Please create/activate a dhikr type
            first from the Dhikr Types page.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Dhikr type *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              {...register("dhikrTypeId", {
                required: "Dhikr type is required",
              })}
            >
              {activeTypes.length === 0 ? (
                <option value="">No active dhikr types</option>
              ) : (
                activeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.nameAr})
                  </option>
                ))
              )}
            </select>
            {errors.dhikrTypeId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.dhikrTypeId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="one_time"
                  {...register("assignmentType")}
                />
                One time
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="weekly"
                  {...register("assignmentType")}
                />
                Weekly
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              One time: requires expiry date/time. Weekly: requires start/end
              dates. Weekly auto-repeat backend khud handle karta hai.
            </p>
          </div>

          <Input
            label="Total target (whole community goal) *"
            type="number"
            min={1}
            placeholder="e.g. 10000"
            hint="Total for the entire community pool — not per member"
            error={errors.targetQuantity?.message}
            {...register("targetQuantity", {
              required: "Target quantity is required",
              min: { value: 1, message: "Must be at least 1" },
              valueAsNumber: true,
            })}
          />

          {!isWeekly && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expires at *
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("expiresAt", {
                  required: !isWeekly
                    ? "Expiry date/time is required for one-time assignment"
                    : false,
                })}
              />
              {errors.expiresAt && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>
          )}

          {isWeekly && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Week start *
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("periodStart", {
                    required: isWeekly ? "Week start is required" : false,
                  })}
                />
                {errors.periodStart && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.periodStart.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Week end *
                </label>
                <input
                  type="date"
                  min={periodStart || undefined}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("periodEnd", {
                    required: isWeekly ? "Week end is required" : false,
                  })}
                />
                {errors.periodEnd && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.periodEnd.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={activeTypes.length === 0}
          >
            Create community dhikr task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDhikrTaskModal;

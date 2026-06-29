import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { CreateQaTagDTO } from "@/utils/helpers/models/qa/create-qa-tag.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import {
  QA_TAG_SLUG_PATTERN,
  QA_TAG_SLUG_VALIDATION_MESSAGE,
  toQaTagSlug,
  type QaTagMutationResult,
} from "@/utils/helpers/qa/helpers";

interface TagFormValues {
  labelEn: string;
  labelAr: string;
  slug: string;
}

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: QaTagDTO[];
  onRefresh: () => void;
  createTag: (body: CreateQaTagDTO) => Promise<QaTagMutationResult>;
  updateTag: (id: string, body: CreateQaTagDTO) => Promise<QaTagMutationResult>;
  deleteTag: (id: string) => Promise<boolean>;
}

const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onRefresh,
  createTag,
  updateTag,
  deleteTag,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const slugManuallyEdited = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    defaultValues: {
      labelEn: "",
      labelAr: "",
      slug: "",
    },
  });

  const labelEn = watch("labelEn");

  const resetForm = () => {
    setEditingId(null);
    slugManuallyEdited.current = false;
    reset({ labelEn: "", labelAr: "", slug: "" });
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen, reset]);

  useEffect(() => {
    if (!editingId && labelEn && !slugManuallyEdited.current) {
      setValue("slug", toQaTagSlug(labelEn), { shouldValidate: false });
    }
  }, [labelEn, editingId, setValue]);

  const startEdit = (tag: QaTagDTO) => {
    setEditingId(tag.id);
    slugManuallyEdited.current = true;
    reset({
      labelEn: tag.labelEn,
      labelAr: tag.labelAr,
      slug: tag.slug,
    });
  };

  const onSubmit = async (values: TagFormValues) => {
    const body = new CreateQaTagDTO({
      labelEn: values.labelEn.trim(),
      labelAr: values.labelAr.trim(),
      slug: values.slug.trim(),
    });

    const result = editingId
      ? await updateTag(editingId, body)
      : await createTag(body);

    if (result.success) {
      resetForm();
      onRefresh();
      return;
    }

    if (result.fieldErrors?.slug) {
      setError("slug", { message: result.fieldErrors.slug });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Delete this tag? Q&A items using it must be reassigned first.",
    );
    if (result.isConfirmed) {
      const ok = await deleteTag(id);
      if (ok) {
        if (editingId === id) resetForm();
        onRefresh();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Q&A Tags"
      className="max-w-2xl max-h-[90vh]"
    >
      <div className="space-y-6 -mt-2">
        <p className="text-sm text-muted">
          Slug is the technical identifier; labels are shown in the UI.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
        >
          <h3 className="text-sm font-bold text-gray-900">
            {editingId ? "Edit tag" : "New tag"}
          </h3>
          <Input
            label="Label (English) *"
            error={errors.labelEn?.message}
            {...register("labelEn", { required: "English label is required" })}
            placeholder="e.g. Prayer"
          />
          <Input
            label="Label (Arabic) *"
            error={errors.labelAr?.message}
            dir="rtl"
            {...register("labelAr", { required: "Arabic label is required" })}
            placeholder="مثال: الصلاة"
          />
          <Input
            label="Slug *"
            error={errors.slug?.message}
            hint="Lowercase letters, numbers, and hyphens only (e.g. prayer, daily-wird)"
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: QA_TAG_SLUG_PATTERN,
                message: QA_TAG_SLUG_VALIDATION_MESSAGE,
              },
              onChange: () => {
                slugManuallyEdited.current = true;
              },
            })}
            placeholder="prayer"
          />
          <div className="flex gap-2 justify-end">
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel edit
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Plus size={16} />}
              isLoading={isSubmitting}
            >
              {editingId ? "Update tag" : "Add tag"}
            </Button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Label (EN)</th>
                <th className="px-4 py-3">Label (AR)</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No tags yet. Create one above.
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr
                    key={tag.id}
                    className="border-t border-gray-100 bg-white hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {tag.labelEn}
                    </td>
                    <td className="px-4 py-3 text-gray-600" dir="rtl">
                      {tag.labelAr}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {tag.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(tag)}
                          className="p-2 text-gray-500 hover:text-primary rounded-lg"
                          aria-label={`Edit ${tag.labelEn}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tag.id)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                          aria-label={`Delete ${tag.labelEn}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default ManageTagsModal;

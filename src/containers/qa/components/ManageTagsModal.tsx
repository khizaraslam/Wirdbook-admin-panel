import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { QaTagDTO } from "@/utils/helpers/models/qa/qa-tag.dto";
import { CreateQaTagDTO } from "@/utils/helpers/models/qa/create-qa-tag.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: QaTagDTO[];
  onRefresh: () => void;
  createTag: (body: CreateQaTagDTO) => Promise<boolean>;
  updateTag: (id: string, body: CreateQaTagDTO) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
}

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onRefresh,
  createTag,
  updateTag,
  deleteTag,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setNameEn("");
    setNameAr("");
    setSlug("");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  useEffect(() => {
    if (!editingId && nameEn && !slug) {
      setSlug(toSlug(nameEn));
    }
  }, [nameEn, editingId, slug]);

  const startEdit = (tag: QaTagDTO) => {
    setEditingId(tag.id);
    setNameEn(tag.labelEn);
    setNameAr(tag.labelAr);
    setSlug(tag.slug || toSlug(tag.labelEn));
  };

  const handleSave = async () => {
    if (!nameEn.trim() || !nameAr.trim()) return;
    setIsSaving(true);
    const body = new CreateQaTagDTO({
      labelEn: nameEn.trim(),
      labelAr: nameAr.trim(),
      slug: slug.trim() || toSlug(nameEn),
    });
    const ok = editingId
      ? await updateTag(editingId, body)
      : await createTag(body);
    setIsSaving(false);
    if (ok) {
      resetForm();
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Delete this tag? Q&A items may lose their tag association.",
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
      className="max-w-xl max-h-[90vh]"
    >
      <div className="space-y-6 -mt-2">
        <p className="text-sm text-muted">
          Organize questions with bilingual tags
        </p>

        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            {editingId ? "Edit tag" : "New tag"}
          </h3>
          <Input
            label="Name (English) *"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="e.g. Prayer"
          />
          <Input
            label="Name (Arabic) *"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="مثال: الصلاة"
            dir="rtl"
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated"
            muted
          />
          <div className="flex gap-2 justify-end">
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel edit
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus size={16} />}
              isLoading={isSaving}
              onClick={handleSave}
              disabled={!nameEn.trim() || !nameAr.trim()}
            >
              {editingId ? "Update tag" : "Add tag"}
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No tags yet. Create one above.
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tag size={16} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {tag.labelEn}
                    </p>
                    <p className="text-xs text-gray-500 truncate" dir="rtl">
                      {tag.labelAr}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(tag)}
                    className="p-2 text-gray-500 hover:text-primary rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ManageTagsModal;

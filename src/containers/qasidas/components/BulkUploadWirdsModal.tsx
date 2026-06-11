import React, { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";

interface BulkUploadWirdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, replace: boolean) => Promise<boolean>;
}

const BulkUploadWirdsModal: React.FC<BulkUploadWirdsModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [replace, setReplace] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setReplace(false);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (replace) {
      const result = await confirmationPopup(
        "Replace all existing wirds?",
        "This will delete every wird on this qasida before importing the JSON file. This cannot be undone.",
      );
      if (!result.isConfirmed) return;
    }

    setUploading(true);
    const ok = await onUpload(file, replace);
    setUploading(false);
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload JSON"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label block mb-2">JSON file *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted mt-2">
            Accepts qasida.json format (array or wrapped with &quot;wirds&quot;).
            Max 10 MB.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="bulk-replace-wirds"
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-primary"
            checked={replace}
            onChange={(e) => setReplace(e.target.checked)}
          />
          <label htmlFor="bulk-replace-wirds" className="text-sm text-gray-700">
            <span className="font-medium">Replace existing wirds</span>
            <span className="block text-muted text-xs mt-0.5">
              Delete all current wirds before importing (append if unchecked).
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!file}
            isLoading={uploading}
          >
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkUploadWirdsModal;

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { AdminAccessApi } from "@/libs/apis/admin-access.api";
import { successToaster } from "@/utils/helpers/common/alert-service";

export default function ChangeAdminPasswordModal({
  onClose,
  onChanged,
}: {
  onClose: () => void;
  onChanged: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (newPassword !== confirmation) {
      setError("The new passwords do not match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await AdminAccessApi.changeOwnPassword({ currentPassword, newPassword });
      successToaster("Password changed. Sign in again.");
      onChanged();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not change the password.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      title="Change password"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={saving} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            label="New password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={72}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            rightElement={
              <button
                type="button"
                aria-label={visible ? "Hide new password" : "Show new password"}
                className="rounded p-1 text-gray-500 hover:text-primary focus-visible:outline-primary"
                onClick={() => setVisible((value) => !value)}
              >
                {visible ? (
                  <EyeOff size={18} aria-hidden />
                ) : (
                  <Eye size={18} aria-hidden />
                )}
              </button>
            }
          />
          <Input
            label="Confirm new password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            Change password
          </Button>
        </div>
      </form>
    </Modal>
  );
}

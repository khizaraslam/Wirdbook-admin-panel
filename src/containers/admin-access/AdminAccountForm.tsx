import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Shuffle } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import {
  AdminAccessApi,
  type AdminModuleOption,
} from "@/libs/apis/admin-access.api";
import {
  adminActionLabels,
  adminActions,
  canPerformAdminAction,
  type AdminAction,
  type AdminProfile,
} from "@/utils/helpers/admin-access";

const passwordAlphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function generatePassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(
    bytes,
    (byte) => passwordAlphabet[byte % passwordAlphabet.length],
  ).join("");
}

export default function AdminAccountForm({
  account,
  modules,
  onClose,
  onSaved,
}: {
  account: AdminProfile | null;
  modules: AdminModuleOption[];
  onClose: () => void;
  onSaved: (account: AdminProfile) => void;
}) {
  const [email, setEmail] = useState(account?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState(() =>
    account
      ? modules.flatMap(({ key, actions }) =>
          actions
            .filter((action) =>
              canPerformAdminAction({ ...account, enabled: true }, key, action),
            )
            .map((action) => `${key}:${action}`),
        )
      : [],
  );
  const [enabled, setEnabled] = useState(account?.enabled ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const permissionsChanged =
    account &&
    (permissions.length !== account.permissions.length ||
      permissions.some(
        (permission) => !account.permissions.includes(permission),
      ));
  const hasChanges =
    !account ||
    permissionsChanged ||
    enabled !== account.enabled ||
    password !== "";

  function toggleAction(module: string, action: AdminAction) {
    const permission = `${module}:${action}`;
    setPermissions((current) => {
      if (current.includes(permission)) {
        return action === "view"
          ? current.filter((key) => !key.startsWith(`${module}:`))
          : current.filter((key) => key !== permission);
      }
      return [...new Set([...current, `${module}:view`, permission])];
    });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !hasChanges) return;
    setSaving(true);
    setError("");
    try {
      const saved = account
        ? await AdminAccessApi.update(account.id, {
            ...(permissionsChanged && { permissions }),
            ...(enabled !== account.enabled && { enabled }),
            ...(password !== "" && { password }),
          })
        : await AdminAccessApi.create({
            email: email.trim(),
            password,
            permissions,
          });
      onSaved(saved);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save the account.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={() => {
        if (!saving) onClose();
      }}
      title={account ? "Edit admin access" : "Create limited admin"}
      className="max-w-3xl"
    >
      <form onSubmit={save} className="space-y-5">
        <fieldset disabled={saving} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="off"
            required
            maxLength={254}
            value={email}
            disabled={Boolean(account)}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-0 flex-1 basis-56">
                <Input
                  label={
                    account ? "New password (optional)" : "Initial password"
                  }
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required={!account}
                  minLength={12}
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  rightElement={
                    <button
                      type="button"
                      className="rounded p-1 text-gray-500 hover:text-primary focus-visible:outline-primary"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden />
                      ) : (
                        <Eye size={18} aria-hidden />
                      )}
                    </button>
                  }
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                leftIcon={<Shuffle size={16} aria-hidden />}
                onClick={() => setPassword(generatePassword())}
              >
                Generate password
              </Button>
            </div>
            {account && (
              <p className="form-hint">
                Leave blank to keep the current password.
              </p>
            )}
          </div>
          <fieldset className="rounded-lg border border-gray-200 px-4 pb-4">
            <legend className="px-1 text-sm font-semibold text-gray-900">
              Module access
            </legend>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[430px] text-sm text-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="py-2 text-left">
                      Module
                    </th>
                    {adminActions.map((action) => (
                      <th key={action} scope="col" className="px-2 py-2">
                        {adminActionLabels[action]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {modules.map(({ key, label, actions }) => (
                    <tr key={key}>
                      <th scope="row" className="py-2 text-left font-medium">
                        {label}
                      </th>
                      {adminActions.map((action) => (
                        <td key={action} className="px-2 py-2 text-center">
                          {actions.includes(action) && (
                            <input
                              type="checkbox"
                              aria-label={`${label}: ${adminActionLabels[action]}`}
                              checked={permissions.includes(`${key}:${action}`)}
                              onChange={() => toggleAction(key, action)}
                              className="accent-primary"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
          {account && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className="accent-primary"
              />
              Account enabled
            </label>
          )}
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
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={saving} disabled={!hasChanges}>
            {account ? "Save access" : "Create account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

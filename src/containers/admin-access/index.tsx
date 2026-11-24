import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import { AdminAccessApi } from "@/libs/apis/admin-access.api";
import {
  adminActionLabels,
  canPerformAdminAction,
  type AdminProfile,
} from "@/utils/helpers/admin-access";
import {
  confirmationPopup,
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import AdminAccountForm from "./AdminAccountForm";

export default function AdminAccess() {
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof AdminAccessApi.list>
  > | null>(null);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ account: AdminProfile | null } | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    AdminAccessApi.list()
      .then((data) => {
        if (active) setResult(data);
      })
      .catch((error: Error) => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [revision]);

  async function removeAccount(account: AdminProfile) {
    if (deletingId || account.role !== "limited_admin") return;
    setDeletingId(account.id);
    try {
      const confirmation = await confirmationPopup(
        "Delete admin account?",
        `${account.email} will permanently lose access to the admin panel.`,
      );
      if (!confirmation.isConfirmed) return;
      await AdminAccessApi.remove(account.id);
      setResult(
        (current) =>
          current && {
            ...current,
            accounts: current.accounts.filter(({ id }) => id !== account.id),
          },
      );
      successToaster("Admin account deleted.");
    } catch (error) {
      errorToaster(
        error instanceof Error
          ? error.message
          : "Could not delete the account.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function saveAccount(account: AdminProfile) {
    setResult((current) => {
      if (!current) return current;
      const exists = current.accounts.some(({ id }) => id === account.id);
      const accounts = exists
        ? current.accounts.map((row) => (row.id === account.id ? account : row))
        : [account, ...current.accounts];
      return { ...current, accounts };
    });
    successToaster(
      editor?.account ? "Admin access updated." : "Admin account created.",
    );
    setEditor(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Admin Access
        </h1>
        <Button
          type="button"
          leftIcon={<UserPlus size={18} />}
          disabled={!result || deletingId !== null}
          onClick={() => setEditor({ account: null })}
        >
          Add admin
        </Button>
      </div>
      {error ? (
        <div
          className="flex flex-wrap items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <p>{error}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setError("");
              setRevision((current) => current + 1);
            }}
          >
            Retry
          </Button>
        </div>
      ) : !result ? (
        <p role="status" className="text-sm text-gray-600">
          Loading admin accounts…
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {["Email", "Role", "Module access", "Status", "Actions"].map(
                  (column) => (
                    <th key={column} scope="col" className="px-5 py-3">
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.accounts.map((account) => {
                const superAdmin = account.role === "super_admin";
                const modules = result.modules.flatMap(
                  ({ key, label, actions }) => {
                    const granted = actions.filter((action) =>
                      canPerformAdminAction(
                        { ...account, enabled: true },
                        key,
                        action,
                      ),
                    );
                    return granted.length
                      ? [
                          `${label} (${granted.map((action) => adminActionLabels[action]).join(", ")})`,
                        ]
                      : [];
                  },
                );
                return (
                  <tr key={account.id}>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {account.email}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {superAdmin ? "Super Admin" : "Limited Admin"}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {superAdmin
                        ? "All modules"
                        : modules.join("; ") || "No modules assigned"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {account.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {!superAdmin && (
                        <div className="flex flex-wrap gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={deletingId !== null}
                            onClick={() => setEditor({ account })}
                          >
                            Edit access
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            aria-label={`Delete admin account ${account.email}`}
                            disabled={deletingId !== null}
                            isLoading={deletingId === account.id}
                            onClick={() => void removeAccount(account)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {editor && result && (
        <AdminAccountForm
          account={editor.account}
          modules={result.modules}
          onClose={() => setEditor(null)}
          onSaved={saveAccount}
        />
      )}
    </div>
  );
}

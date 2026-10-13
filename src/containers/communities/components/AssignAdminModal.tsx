import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AppUsers_APIS, type AppUserOption } from "@/libs/apis/app-users.api";
import type { CommunityMemberDTO } from "@/utils/helpers/models/communities/community.dto";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => Promise<boolean>;
  communityName: string;
  currentAdminUserId?: string | null;
  members?: CommunityMemberDTO[];
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const parseUsers = (response: unknown): AppUserOption[] => {
  const payload = (response as { success?: boolean; data?: unknown }) || {};
  const data = payload.data;
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { items?: unknown })?.items)
      ? (data as { items: unknown[] }).items
      : [];
  return list
    .map((row) => {
      const item = row as Partial<AppUserOption>;
      if (!item?.id) return null;
      return {
        id: String(item.id),
        name: item.name?.trim() || "Unnamed user",
        phone: item.phone ?? null,
      };
    })
    .filter((row): row is AppUserOption => Boolean(row));
};

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  communityName,
  currentAdminUserId,
  members = [],
}) => {
  const [users, setUsers] = useState<AppUserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [uuidInput, setUuidInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedUserId(currentAdminUserId || "");
    setQuery("");
    setUuidInput("");
    setError("");
    let cancelled = false;
    setLoadingUsers(true);
    AppUsers_APIS.list()
      .then((response) => {
        if (cancelled) return;
        setUsers(parseUsers(response));
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentAdminUserId]);

  const mergedUsers = useMemo(() => {
    const byId = new Map<string, AppUserOption>();
    members.forEach((member) => {
      if (!member.userId) return;
      byId.set(member.userId, {
        id: member.userId,
        name: member.name || "Unnamed user",
        phone: null,
      });
    });
    users.forEach((user) => {
      const existing = byId.get(user.id);
      byId.set(user.id, {
        id: user.id,
        name: user.name || existing?.name || "Unnamed user",
        phone: user.phone ?? existing?.phone ?? null,
      });
    });
    return Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [users, members]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return mergedUsers;
    return mergedUsers.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const phone = user.phone?.toLowerCase() ?? "";
      const id = user.id.toLowerCase();
      return name.includes(term) || phone.includes(term) || id.includes(term);
    });
  }, [mergedUsers, query]);

  const selectedUser = mergedUsers.find((user) => user.id === selectedUserId);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fromUuid = uuidInput.trim();
    const userId = selectedUserId || (UUID_RE.test(fromUuid) ? fromUuid : "");
    if (!userId) {
      setError("Select a user from the list, or paste a valid user UUID.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const ok = await onSubmit(userId);
      if (ok) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign admin — ${communityName}`}
      className="max-w-lg"
    >
      <form onSubmit={submit} noValidate>
        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Member:</span> can join, see the
            community, post on the noticeboard, and take dhikr or Khitma juz.
          </p>
          <p>
            <span className="font-semibold">Admin:</span> can do everything a
            member can, and also remove members, create the community dhikr
            task, and delete other people&apos;s comments.
          </p>
          <p className="text-gray-500">
            Assigning a new admin makes the previous admin a normal member.
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Search users
        </label>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, phone, or UUID"
          className="w-full px-3 py-2 mb-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />

        <p className="text-sm font-medium text-gray-700 mb-1.5">Select user *</p>
        <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-50">
          {loadingUsers ? (
            <p className="px-3 py-4 text-sm text-gray-500">Loading users...</p>
          ) : filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500">
              No users match that search.
            </p>
          ) : (
            filtered.map((user) => {
              const isSelected = user.id === selectedUserId;
              const isCurrent = user.id === currentAdminUserId;
              const isMember = members.some((member) => member.userId === user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setUuidInput("");
                    setError("");
                  }}
                  className={`w-full text-left px-3 py-2.5 transition-colors ${
                    isSelected ? "bg-primary/10" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-900">
                    {user.name}
                    {isCurrent ? " (current admin)" : ""}
                    {isMember && !isCurrent ? " · member" : ""}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {user.phone || "No phone"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {selectedUser && (
          <p className="text-xs text-gray-600 mt-2">
            Selected: <span className="font-semibold">{selectedUser.name}</span>
            {selectedUser.phone ? ` · ${selectedUser.phone}` : ""}
          </p>
        )}

        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1.5">
          Or paste user UUID
        </label>
        <input
          type="text"
          value={uuidInput}
          onChange={(event) => {
            setUuidInput(event.target.value);
            if (event.target.value.trim()) setSelectedUserId("");
            setError("");
          }}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

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

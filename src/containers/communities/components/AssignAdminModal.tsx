import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Communities_APIS } from "@/libs/apis/communities.api";
import type { CommunityMemberDTO } from "@/utils/helpers/models/communities/community.dto";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => Promise<boolean>;
  communityId: string;
  communityName: string;
  currentAdminUserId?: string | null;
  members?: CommunityMemberDTO[];
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  communityId,
  communityName,
  currentAdminUserId,
  members: initialMembers = [],
}) => {
  const [members, setMembers] = useState<CommunityMemberDTO[]>(initialMembers);
  const [loadingMembers, setLoadingMembers] = useState(false);
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
    setMembers(initialMembers);
    let cancelled = false;
    setLoadingMembers(true);
    Communities_APIS.getMembers(communityId)
      .then((response) => {
        if (cancelled) return;
        const data =
          response?.success && Array.isArray(response.data) ? response.data : [];
        setMembers(data as CommunityMemberDTO[]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMembers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, communityId, currentAdminUserId]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) => {
      const name = member.name?.toLowerCase() ?? "";
      const phone = member.phone?.toLowerCase() ?? "";
      const id = member.userId.toLowerCase();
      return name.includes(term) || phone.includes(term) || id.includes(term);
    });
  }, [members, query]);

  const selectedMember = members.find(
    (member) => member.userId === selectedUserId,
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fromUuid = uuidInput.trim();
    const userId = selectedUserId || (UUID_RE.test(fromUuid) ? fromUuid : "");
    if (!userId) {
      setError("Select a community member, or paste a valid user UUID.");
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
            Only members of this community are listed here.
          </p>
          <p className="text-gray-500">
            Assigning a new admin makes the previous admin a normal member.
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Search members
        </label>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, phone, or UUID"
          className="w-full px-3 py-2 mb-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />

        <p className="text-sm font-medium text-gray-700 mb-1.5">
          Community members ({members.length})
        </p>
        <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-50">
          {loadingMembers ? (
            <p className="px-3 py-4 text-sm text-gray-500">
              Loading members...
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500">
              {members.length === 0
                ? "This community has no members yet. Paste a user UUID below."
                : "No members match that search."}
            </p>
          ) : (
            filtered.map((member) => {
              const isSelected = member.userId === selectedUserId;
              const isCurrent = member.userId === currentAdminUserId;
              return (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(member.userId);
                    setUuidInput("");
                    setError("");
                  }}
                  className={`w-full text-left px-3 py-2.5 transition-colors ${
                    isSelected ? "bg-primary/10" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-900">
                    {member.name}
                    {isCurrent ? " (current admin)" : ""}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {member.phone || "No phone"}
                    {member.role === "admin" ? " · admin" : " · member"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {selectedMember && (
          <p className="text-xs text-gray-600 mt-2">
            Selected:{" "}
            <span className="font-semibold">{selectedMember.name}</span>
            {selectedMember.phone ? ` · ${selectedMember.phone}` : ""}
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

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useCommunities from "../useHooks";
import CommunitiesTable from "../components/CommunitiesTable";
import CommunityFormModal from "../components/CommunityFormModal";
import AssignAdminModal from "../components/AssignAdminModal";
import type { CommunityDTO } from "@/utils/helpers/models/communities/community.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";

const CommunitiesListPage = () => {
  const { getAll, create, update, updateStatus, assignAdmin } =
    useCommunities();
  const { isLoading } = useStore();
  const [communities, setCommunities] = useState<CommunityDTO[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<CommunityDTO | null>(
    null,
  );
  const [assigningCommunity, setAssigningCommunity] =
    useState<CommunityDTO | null>(null);

  const loadCommunities = useCallback(async () => {
    const data = await getAll();
    setCommunities(data);
  }, [getAll]);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  const handleCreate = async (name: string) => {
    const ok = await create(name);
    if (ok) {
      await loadCommunities();
    }
    return ok;
  };

  const handleUpdate = async (name: string) => {
    if (!editingCommunity) return false;
    const ok = await update(editingCommunity.id, name);
    if (ok) {
      setEditingCommunity(null);
      await loadCommunities();
    }
    return ok;
  };

  const handleToggleStatus = async (community: CommunityDTO) => {
    const nextStatus =
      community.status === "active" ? "inactive" : "active";
    const action = nextStatus === "active" ? "activate" : "deactivate";
    const confirmed = await confirmationPopup(
      `${action.charAt(0).toUpperCase() + action.slice(1)} community?`,
      `This will ${action} "${community.name}". Inactive communities won't appear in signup/join lists.`,
    );
    if (!confirmed) return;
    const ok = await updateStatus(community.id, nextStatus);
    if (ok) await loadCommunities();
  };

  const handleAssignAdmin = async (userId: string) => {
    if (!assigningCommunity) return false;
    const ok = await assignAdmin(assigningCommunity.id, userId);
    if (ok) {
      setAssigningCommunity(null);
      await loadCommunities();
    }
    return ok;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={28} className="text-primary" />
            Communities
          </h1>
          <p className="text-gray-500 mt-1">
            Manage communities, admins, and membership
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add community
        </Button>
      </div>

      {!isLoading && communities.length === 0 ? (
        <CustomMessageDisplay
          show
          title="No communities found"
          slogan="Create your first community to get started."
        />
      ) : (
        <CommunitiesTable
          communities={communities}
          onEdit={setEditingCommunity}
          onToggleStatus={handleToggleStatus}
          onAssignAdmin={setAssigningCommunity}
        />
      )}

      <CommunityFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        title="Create community"
        submitLabel="Create"
      />

      <CommunityFormModal
        isOpen={!!editingCommunity}
        onClose={() => setEditingCommunity(null)}
        onSubmit={handleUpdate}
        initialName={editingCommunity?.name ?? ""}
        title="Edit community"
        submitLabel="Save"
      />

      {assigningCommunity && (
        <AssignAdminModal
          isOpen={!!assigningCommunity}
          onClose={() => setAssigningCommunity(null)}
          onSubmit={handleAssignAdmin}
          communityName={assigningCommunity.name}
        />
      )}
    </div>
  );
};

export default CommunitiesListPage;

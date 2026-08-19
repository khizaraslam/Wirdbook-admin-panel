import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, ToggleLeft, ToggleRight } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useCommunities from "../useHooks";
import MembersTable from "../components/MembersTable";
import AssignAdminModal from "../components/AssignAdminModal";
import CommunityFormModal from "../components/CommunityFormModal";
import type {
  CommunityDTO,
  CommunityMemberDTO,
} from "@/utils/helpers/models/communities/community.dto";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CommunityDhikrTab from "../components/CommunityDhikrTab";

const CommunityDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { getOne, getMembers, update, updateStatus, assignAdmin } =
    useCommunities();
  const { isLoading } = useStore();
  const [community, setCommunity] = useState<CommunityDTO | null>(null);
  const [members, setMembers] = useState<CommunityMemberDTO[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "dhikr">("members");

  const loadData = useCallback(async () => {
    if (!id) return;
    const [communityData, membersData] = await Promise.all([
      getOne(id),
      getMembers(id),
    ]);
    setCommunity(communityData);
    setMembers(membersData);
  }, [id, getOne, getMembers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdate = async (name: string) => {
    if (!community) return false;
    const ok = await update(community.id, name);
    if (ok) {
      setIsEditOpen(false);
      await loadData();
    }
    return ok;
  };

  const handleToggleStatus = async () => {
    if (!community) return;
    const nextStatus =
      community.status === "active" ? "inactive" : "active";
    const action = nextStatus === "active" ? "activate" : "deactivate";
    const confirmed = await confirmationPopup(
      `${action.charAt(0).toUpperCase() + action.slice(1)} community?`,
      `This will ${action} "${community.name}".`,
    );
    if (!confirmed) return;
    const ok = await updateStatus(community.id, nextStatus);
    if (ok) await loadData();
  };

  const handleAssignAdmin = async (userId: string) => {
    if (!community) return false;
    const ok = await assignAdmin(community.id, userId);
    if (ok) {
      setIsAssignOpen(false);
      await loadData();
    }
    return ok;
  };

  if (!isLoading && !community) {
    return (
      <div className="p-6">
        <Link
          to={siteRoutes.communities}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to communities
        </Link>
        <CustomMessageDisplay show title="Community not found" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link
        to={siteRoutes.communities}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={16} />
        Back to communities
      </Link>

      {community && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {community.name}
                </h1>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                    community.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {community.status}
                </span>
              </div>
              <p className="text-gray-500 mt-1">
                Admin:{" "}
                {community.adminName || (
                  <span className="italic">Unassigned</span>
                )}{" "}
                · {community.memberCount} members
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
                Edit name
              </Button>
              <Button variant="secondary" onClick={() => setIsAssignOpen(true)}>
                <UserPlus size={16} className="mr-2" />
                Assign admin
              </Button>
              <Button variant="secondary" onClick={handleToggleStatus}>
                {community.status === "active" ? (
                  <>
                    <ToggleRight size={16} className="mr-2 text-emerald-600" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleLeft size={16} className="mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  activeTab === "members"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Members
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dhikr")}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  activeTab === "dhikr"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dhikr
              </button>
            </div>
          </div>

          {activeTab === "members" ? (
            <MembersTable members={members} />
          ) : (
            <CommunityDhikrTab communityId={community.id} />
          )}

          <CommunityFormModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleUpdate}
            initialName={community.name}
            title="Edit community"
            submitLabel="Save"
          />

          <AssignAdminModal
            isOpen={isAssignOpen}
            onClose={() => setIsAssignOpen(false)}
            onSubmit={handleAssignAdmin}
            communityName={community.name}
          />
        </>
      )}
    </div>
  );
};

export default CommunityDetailPage;

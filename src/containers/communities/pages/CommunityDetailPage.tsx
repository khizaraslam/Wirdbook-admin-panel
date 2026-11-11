import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useCommunities from "../useHooks";
import type { CommunityFormPayload } from "../useHooks";
import MembersTable from "../components/MembersTable";
import AssignAdminModal from "../components/AssignAdminModal";
import CommunityFormModal from "../components/CommunityFormModal";
import type {
  CommunityDetailDTO,
  CommunityMemberDTO,
} from "@/utils/helpers/models/communities/community.dto";
import { getCommunityImageUrl } from "@/utils/helpers/communities/helpers";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CommunityDhikrTab from "../components/CommunityDhikrTab";
import NoticeboardModerationTab from "../components/NoticeboardModerationTab";

type DetailTab = "members" | "dhikr" | "noticeboard";

const CommunityDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { getOne, update, updateStatus, assignAdmin, removeMember } =
    useCommunities();
  const { isLoading } = useStore();
  const [community, setCommunity] = useState<CommunityDetailDTO | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("members");
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    const communityData = await getOne(id);
    setCommunity(communityData);
  }, [id, getOne]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdate = async (payload: CommunityFormPayload) => {
    if (!community) return false;
    const ok = await update(community.id, payload);
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
    const result = await confirmationPopup(
      `${action.charAt(0).toUpperCase() + action.slice(1)} community?`,
      `This will ${action} "${community.name}".`,
    );
    if (!result.isConfirmed) return;
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

  const handleRemoveMember = async (member: CommunityMemberDTO) => {
    if (!community || removingUserId) return;
    const result = await confirmationPopup(
      "Remove member?",
      `Remove ${member.name} from "${community.name}". They cannot rejoin until an admin approves them.`,
    );
    if (!result.isConfirmed) return;
    setRemovingUserId(member.userId);
    const ok = await removeMember(community.id, member.userId);
    setRemovingUserId(null);
    if (ok) await loadData();
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

  const members = community?.members ?? [];
  const imageUrl = community ? getCommunityImageUrl(community.imageUrl) : "";

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
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={community.name}
                className="w-full lg:w-48 h-48 rounded-2xl object-cover border border-gray-100 shrink-0"
              />
            ) : (
              <div className="w-full lg:w-48 h-48 rounded-2xl bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                No image
              </div>
            )}

            <div className="flex-1">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {community.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </Button>
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
            </div>
          </div>

          <div className="mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(
                [
                  ["members", "Members"],
                  ["dhikr", "Dhikr"],
                  ["noticeboard", "Noticeboard"],
                ] as const
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "members" && (
            <MembersTable
              members={members}
              onRemove={handleRemoveMember}
              removingUserId={removingUserId}
            />
          )}
          {activeTab === "dhikr" && (
            <CommunityDhikrTab communityId={community.id} />
          )}
          {activeTab === "noticeboard" && (
            <NoticeboardModerationTab communityId={community.id} />
          )}

          <CommunityFormModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleUpdate}
            initialName={community.name}
            initialImageUrl={community.imageUrl}
            title="Edit community"
            submitLabel="Save"
            status={community.status}
            onToggleStatus={handleToggleStatus}
            onAssignAdmin={() => setIsAssignOpen(true)}
          />

          <AssignAdminModal
            isOpen={isAssignOpen}
            onClose={() => setIsAssignOpen(false)}
            onSubmit={handleAssignAdmin}
            communityId={community.id}
            communityName={community.name}
            currentAdminUserId={community.adminUserId}
            members={members}
          />
        </>
      )}
    </div>
  );
};

export default CommunityDetailPage;

import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, ToggleLeft, ToggleRight } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useCommunities from "../useHooks";
import type { CommunityFormPayload } from "../useHooks";
import MembersTable from "../components/MembersTable";
import AssignAdminModal from "../components/AssignAdminModal";
import CommunityFormModal from "../components/CommunityFormModal";
import type { CommunityDetailDTO } from "@/utils/helpers/models/communities/community.dto";
import { getCommunityImageUrl } from "@/utils/helpers/communities/helpers";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CommunityDhikrTab from "../components/CommunityDhikrTab";
import NoticeboardModerationTab from "../components/NoticeboardModerationTab";

type DetailTab = "members" | "dhikr" | "noticeboard";

const CommunityDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { getOne, update, updateStatus, assignAdmin } = useCommunities();
  const { isLoading } = useStore();
  const [community, setCommunity] = useState<CommunityDetailDTO | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("members");

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

            <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
                  Edit community
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

          {activeTab === "members" && <MembersTable members={members} />}
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

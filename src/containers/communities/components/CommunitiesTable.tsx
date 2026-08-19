import React from "react";
import { Link } from "react-router-dom";
import {
  Edit2,
  UserPlus,
  Eye,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { CommunityDTO } from "@/utils/helpers/models/communities/community.dto";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

interface CommunitiesTableProps {
  communities: CommunityDTO[];
  onEdit: (community: CommunityDTO) => void;
  onToggleStatus: (community: CommunityDTO) => void;
  onAssignAdmin: (community: CommunityDTO) => void;
}

const formatDate = (value: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
};

const CommunitiesTable: React.FC<CommunitiesTableProps> = ({
  communities,
  onEdit,
  onToggleStatus,
  onAssignAdmin,
}) => {
  const columns = ["Name", "Admin", "Members", "Status", "Created", "Actions"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Communities
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {communities.length} communities
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {communities.map((community) => (
              <tr
                key={community.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">
                    {community.name}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {community.adminName || (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-gray-700">
                    <Users size={14} className="text-gray-400" />
                    {community.memberCount}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      community.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {community.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm">
                  {formatDate(community.createdAt)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`${siteRoutes.communities}/${community.id}`}
                      title="View details"
                    >
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(community)}
                      title="Edit name"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssignAdmin(community)}
                      title="Assign admin"
                    >
                      <UserPlus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(community)}
                      title={
                        community.status === "active"
                          ? "Deactivate"
                          : "Activate"
                      }
                    >
                      {community.status === "active" ? (
                        <ToggleRight size={16} className="text-emerald-600" />
                      ) : (
                        <ToggleLeft size={16} className="text-gray-400" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunitiesTable;

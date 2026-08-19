import React from "react";
import { Shield, User } from "lucide-react";
import type { CommunityMemberDTO } from "@/utils/helpers/models/communities/community.dto";

interface MembersTableProps {
  members: CommunityMemberDTO[];
}

const formatDate = (value: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
};

const MembersTable: React.FC<MembersTableProps> = ({ members }) => {
  const columns = ["Name", "User ID", "Role", "Joined"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Members
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {members.length} members
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
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
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-gray-400"
                >
                  No members yet
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.userId}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm font-mono">
                    {member.userId}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.role === "admin"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.role === "admin" ? (
                        <Shield size={12} />
                      ) : (
                        <User size={12} />
                      )}
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {formatDate(member.joinedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;

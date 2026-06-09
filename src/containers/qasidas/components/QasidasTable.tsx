import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Qasida } from "@/utils/helpers/models/qasidas/qasida.dto";
import { formatDuration } from "@/utils/helpers/qasidas/helpers";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

interface QasidasTableProps {
  qasidas: Qasida[];
  total: number;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

const QasidasTable: React.FC<QasidasTableProps> = ({
  qasidas,
  total,
  onToggleEnabled,
  onDelete,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          All Qasidas
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {total} qasidas found
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              {[
                "#",
                "Title EN",
                "Title AR",
                "Author",
                "Mode",
                "Wirds",
                "Duration",
                "Enabled",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="py-4 px-3 text-sm font-bold text-gray-400 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {qasidas.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 px-3 text-sm text-gray-500">
                  {item.indexOrder}
                </td>
                <td className="py-3 px-3 text-sm font-medium text-gray-900 max-w-[140px] truncate">
                  {item.title.en}
                </td>
                <td
                  className="py-3 px-3 text-sm text-gray-700 max-w-[140px] truncate"
                  dir="rtl"
                >
                  {item.title.ar}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 max-w-[120px] truncate">
                  {item.author?.en || "—"}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {item.mode?.en || "—"}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {item.totalWirds}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {formatDuration(item.audioDuration)}
                </td>
                <td className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => onToggleEnabled(item.id, !item.isEnabled)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                      item.isEnabled
                        ? "border-emerald-200 text-emerald-800 bg-emerald-50"
                        : "border-amber-200 text-amber-800 bg-amber-50"
                    }`}
                  >
                    {item.isEnabled ? "On" : "Off"}
                  </button>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`${siteRoutes.qasidas}/${item.id}/edit`}
                      className="p-2 text-primary hover:bg-primary-light border border-primary/10 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default QasidasTable;

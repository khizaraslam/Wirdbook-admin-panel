import React from "react";
import { Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";

interface DhikrTypesTableProps {
  items: DhikrTypeDTO[];
  onEdit: (item: DhikrTypeDTO) => void;
}

const formatDate = (value: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
};

const DhikrTypesTable: React.FC<DhikrTypesTableProps> = ({ items, onEdit }) => {
  const columns = [
    "Order",
    "Name",
    "Arabic",
    "Description",
    "Status",
    "Created",
    "Actions",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Dhikr types
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {items.length} types
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
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4 text-gray-600">{item.sortOrder}</td>
                <td className="py-4 px-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="py-4 px-4 text-gray-800" dir="rtl">
                  {item.nameAr}
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm max-w-[200px] truncate">
                  {item.description || "—"}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-4 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DhikrTypesTable;

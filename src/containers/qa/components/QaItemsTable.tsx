import React from "react";
import {
  HelpCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import Button from "@/components/ui/Button";

interface QaItemsTableProps {
  items: QaItemDTO[];
  totalElements: number;
  onEdit: (item: QaItemDTO) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (item: QaItemDTO) => void;
}

const formatDate = (value: string) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
};

const QaItemsTable: React.FC<QaItemsTableProps> = ({
  items,
  totalElements,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const columns = [
    "Question",
    "Tag",
    "Status",
    "Date",
    "Actions",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Questions & Answers
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {totalElements} items found
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              {columns.map((column) => (
                <th
                  key={column}
                  className={`py-5 px-4 text-sm font-bold text-gray-400 whitespace-nowrap ${
                    column === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length > 0 ? (
              items.map((item) => {
                const tagLabel =
                  item.tag?.labelEn ||
                  item.tag?.labelAr ||
                  "Uncategorized";
                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-2 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-50 text-gray-400 rounded-lg shrink-0 border border-transparent group-hover:border-primary/10">
                          <HelpCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-semibold text-gray-900 text-sm truncate"
                            dir="ltr"
                          >
                            {item.questionEn || "—"}
                          </p>
                          <p
                            className="text-xs text-gray-500 mt-1 truncate"
                            dir="rtl"
                          >
                            {item.questionAr || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary/5 text-primary font-bold text-[10px] uppercase tracking-wider">
                        <Tag size={12} />
                        {tagLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                          item.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onTogglePublish(item)}
                          title={
                            item.isPublished ? "Unpublish" : "Publish"
                          }
                          className="p-2 text-gray-500 hover:text-primary"
                        >
                          {item.isPublished ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="p-2 text-gray-500 hover:text-primary"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-400 font-medium"
                >
                  No Q&A items match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QaItemsTable;

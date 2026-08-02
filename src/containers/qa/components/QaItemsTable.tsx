import React from "react";
import {
  HelpCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  XCircle,
  User,
} from "lucide-react";
import { QaItemDTO } from "@/utils/helpers/models/qa/qa-item.dto";
import Button from "@/components/ui/Button";
import {
  canPublishQaItem,
  canPublishQaStatus,
  canRejectQaItem,
  canUnpublishQaItem,
  formatQaSourceLabel,
  formatQaStatusLabel,
  formatQaVisibilityLabel,
  getAskerDisplayName,
  needsAnswer,
  QA_SOURCE_STYLES,
  QA_STATUS_STYLES,
  QA_VISIBILITY_STYLES,
} from "@/utils/helpers/qa/helpers";

interface QaItemsTableProps {
  items: QaItemDTO[];
  totalElements: number;
  onEdit: (item: QaItemDTO) => void;
  onDelete: (id: string) => void;
  onPublish: (item: QaItemDTO) => void;
  onUnpublish: (item: QaItemDTO) => void;
  onReject: (item: QaItemDTO) => void;
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
  onPublish,
  onUnpublish,
  onReject,
}) => {
  const columns = [
    "Question",
    "Asker",
    "Visibility",
    "Tag",
    "Source",
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
        <table className="w-full text-left border-collapse min-w-[1100px]">
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
                const publishable = canPublishQaItem(item);
                const showPublish =
                  canPublishQaStatus(item.status) && publishable;
                const showUnpublish = canUnpublishQaItem(item.status);
                const showReject = canRejectQaItem(item.status);
                const askerName = getAskerDisplayName(item);

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
                            {item.questionEn || item.questionAr || "—"}
                          </p>
                          {item.questionAr && item.questionEn && (
                            <p
                              className="text-xs text-gray-500 mt-1 truncate"
                              dir="rtl"
                            >
                              {item.questionAr}
                            </p>
                          )}
                          {needsAnswer(item) && (
                            <span className="inline-flex mt-2 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                              Needs answer
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-gray-700">
                        {item.source === "user" && (
                          <User size={14} className="text-gray-400 shrink-0" />
                        )}
                        <span className="truncate max-w-[120px]">{askerName}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_VISIBILITY_STYLES[item.visibility]}`}
                      >
                        {formatQaVisibilityLabel(item.visibility)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary/5 text-primary font-bold text-[10px] uppercase tracking-wider">
                        <Tag size={12} />
                        {tagLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_SOURCE_STYLES[item.source]}`}
                      >
                        {formatQaSourceLabel(item.source)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${QA_STATUS_STYLES[item.status]}`}
                      >
                        {formatQaStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {showPublish && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onPublish(item)}
                            title="Publish"
                            className="p-2 text-gray-500 hover:text-emerald-600"
                          >
                            <Eye size={18} />
                          </Button>
                        )}
                        {showUnpublish && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onUnpublish(item)}
                            title="Unpublish"
                            className="p-2 text-gray-500 hover:text-amber-600"
                          >
                            <EyeOff size={18} />
                          </Button>
                        )}
                        {showReject && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onReject(item)}
                            title="Reject"
                            className="p-2 text-gray-500 hover:text-red-600"
                          >
                            <XCircle size={18} />
                          </Button>
                        )}
                        {!showPublish &&
                          canPublishQaStatus(item.status) &&
                          !publishable && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled
                              title="Fill EN + AR answers before publishing"
                              className="p-2 text-gray-300 cursor-not-allowed"
                            >
                              <Eye size={18} />
                            </Button>
                          )}
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

import React from "react";
import { FileText, Edit2, Trash2, ChevronDown } from "lucide-react";
import { LecturesDTO } from "@/utils/helpers/models/lectures/lectures.dto";

interface LecturesTableProps {
  lectures: LecturesDTO[];
  onEdit: (lecture: LecturesDTO) => void;
  onDelete: (id: string) => void;
  onMoveToTab?: (id: string, tabId: string) => void;
  availableTabs?: { id: string; label: string }[];
  title: string;
  totalElements: number;
}

const LecturesTable: React.FC<LecturesTableProps> = ({
  lectures,
  onEdit,
  onDelete,
  onMoveToTab,
  availableTabs = [],
  title,
  totalElements,
}) => {
  const getTabLabel = (lecture: LecturesDTO) => {
    return lecture.tab?.label || "Uncategorized";
  };

  const getTabColor = (tabLabel: string) => {
    switch (tabLabel.toLowerCase()) {
      case "wisdoms":
        return "bg-green-500 text-white";
      case "shamael":
        return "bg-green-600 text-white";
      case "teachings":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return { date: "N/A", time: "N/A" };
    try {
      const dt = new Date(dateTimeStr);
      return {
        date: dt.toLocaleDateString(),
        time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    } catch {
      return { date: "N/A", time: "N/A" };
    }
  };

  const columns: string[] = [
    "Title",
    "Date",
    "Time",
    "Current Tab",
    "Move To",
    "Action",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {totalElements} lectures found
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`py-5 px-4 text-sm font-bold text-gray-400 whitespace-nowrap ${index === columns.length - 1 ? "text-right" : "text-left"}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lectures.length > 0 ? (
              lectures.map((lecture) => {
                const { date, time } = formatDateTime(lecture.dateTime);
                const tabLabel = getTabLabel(lecture);
                return (
                  <tr
                    key={lecture.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-white group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/10">
                          <FileText size={18} />
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors cursor-pointer text-sm">
                          {lecture.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600">
                      {date}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600">
                      {time}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${getTabColor(tabLabel)}`}
                      >
                        {tabLabel}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="relative group/select w-full max-w-[140px]">
                        <select
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-xs font-bold text-gray-900 cursor-pointer hover:bg-white hover:border-primary/20 transition-all outline-none appearance-none"
                          value={lecture.tabId || ""}
                          onChange={(e) =>
                            onMoveToTab?.(lecture.id, e.target.value)
                          }
                        >
                          {availableTabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                              {tab.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onEdit(lecture)}
                          className="p-2 hover:text-muted cursor-pointer text-primary hover:bg-primary-light border border-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(lecture.id)}
                          className="p-2 hover:text-red-600 cursor-pointer text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-gray-400 font-medium"
                >
                  No lectures found. Add your first lecture to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LecturesTable;

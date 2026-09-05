import React from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import type { BookDTO } from "@/utils/helpers/models/books/book.dto";
import {
  formatBookDate,
  formatBookSize,
  getBookPublicUrl,
} from "@/utils/helpers/books/helpers";

interface BooksTableProps {
  items: BookDTO[];
  onUpdate: (item: BookDTO) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({ items, onUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
      <div className="border-b border-gray-50 bg-white mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          All books
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-0.5">
          {items.length} {items.length === 1 ? "file" : "files"}
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Filename", "Size", "Updated", "File", "Actions"].map((col) => (
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
                key={item.filename}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-gray-900 break-all">
                  {item.filename}
                </td>
                <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                  {formatBookSize(item.size)}
                </td>
                <td className="py-4 px-4 text-gray-500 text-sm whitespace-nowrap">
                  {formatBookDate(item.updatedAt)}
                </td>
                <td className="py-4 px-4">
                  <a
                    href={getBookPublicUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Open
                    <ExternalLink size={14} />
                  </a>
                </td>
                <td className="py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RefreshCw size={14} />}
                    onClick={() => onUpdate(item)}
                    className="rounded-md"
                  >
                    Update
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

export default BooksTable;

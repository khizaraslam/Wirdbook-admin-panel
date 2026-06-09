import React, { useCallback, useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import WirdModal from "./WirdModal";
import useQasidas from "../useHooks";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import type {
  Pagination as PaginationMeta,
  QasidaWird,
} from "@/utils/helpers/models/qasidas/qasida.dto";

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const WIRDS_PAGE_LIMIT = 25;

interface WirdsTabProps {
  qasidaId: string;
}

const WirdsTab: React.FC<WirdsTabProps> = ({ qasidaId }) => {
  const { listWirds, createWird, updateWird, deleteWird } = useQasidas();
  const [wirds, setWirds] = useState<QasidaWird[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWird, setEditingWird] = useState<QasidaWird | null>(null);

  const load = useCallback(
    (page = 1) => {
      listWirds(
        qasidaId,
        { page, limit: WIRDS_PAGE_LIMIT },
        setWirds,
        setPagination,
      );
    },
    [qasidaId, listWirds],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleSave = async (values: {
    descriptionEn: string;
    descriptionAr: string;
    transliteration: string;
    repetition: number;
    isTitle: boolean;
  }) => {
    const body = {
      descriptionEn: values.descriptionEn.trim(),
      descriptionAr: values.descriptionAr.trim(),
      transliteration: values.transliteration.trim() || null,
      repetition: values.repetition,
      isTitle: values.isTitle,
    };
    const ok = editingWird
      ? await updateWird(qasidaId, editingWird.id, body)
      : await createWird(qasidaId, body);
    if (ok) load(pagination.page);
  };

  const handleDelete = async (wirdId: string) => {
    const result = await confirmationPopup("Delete this wird?");
    if (result.isConfirmed) {
      const ok = await deleteWird(qasidaId, wirdId);
      if (ok) load(pagination.page);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted">
          Paginated wirds for this qasida ({pagination.total} total)
        </p>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditingWird(null);
            setModalOpen(true);
          }}
        >
          Add Wird
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {["Order", "EN", "AR", "Transliteration", "Rep.", "Title", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-3 px-3 text-left text-xs font-bold text-gray-400 uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {wirds.map((w) => (
                <tr
                  key={w.id}
                  className={
                    w.isTitle
                      ? "bg-primary/5 font-semibold"
                      : "hover:bg-gray-50/50"
                  }
                >
                  <td className="py-3 px-3 text-sm text-gray-500">{w.indexOrder}</td>
                  <td className="py-3 px-3 text-sm max-w-[180px] truncate">
                    {w.description.en}
                  </td>
                  <td
                    className="py-3 px-3 text-sm max-w-[180px] truncate"
                    dir="rtl"
                  >
                    {w.description.ar}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600 max-w-[140px] truncate">
                    {w.transliteration || "—"}
                  </td>
                  <td className="py-3 px-3 text-sm">{w.repetition}</td>
                  <td className="py-3 px-3 text-sm">
                    {w.isTitle ? "Yes" : "—"}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWird(w);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-primary border border-primary/10 rounded-lg"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id)}
                        className="p-1.5 text-red-500 border border-gray-200 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination meta={pagination} onPageChange={load} />

      <WirdModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWird(null);
        }}
        wird={editingWird}
        onSave={handleSave}
      />
    </div>
  );
};

export default WirdsTab;

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import QasidasTable from "../components/QasidasTable";
import useQasidas from "../useHooks";
import { useDebounce } from "@/hooks/useDebounce";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import type { Pagination as PaginationMeta, Qasida } from "@/utils/helpers/models/qasidas/qasida.dto";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const QasidasListPage = () => {
  const { listQasidas, updateQasida, deleteQasida } = useQasidas();
  const { isLoading } = useStore();
  const [data, setData] = useState<Qasida[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);

  const debouncedSearch = useDebounce(search, 500);

  const load = useCallback(
    (page = 1, searchTerm = debouncedSearch) => {
      listQasidas(
        { page, limit: pagination.limit, search: searchTerm || undefined },
        setData,
        setPagination,
      );
    },
    [listQasidas, pagination.limit, debouncedSearch],
  );

  useEffect(() => {
    load(1);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    load(page);
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const formData = new FormData();
    formData.append("isEnabled", enabled ? "true" : "false");
    const ok = await updateQasida(id, formData);
    if (ok) load(pagination.page);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Delete this qasida? All wirds and audio will be removed.",
    );
    if (result.isConfirmed) {
      const ok = await deleteQasida(id);
      if (ok) load(pagination.page);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary">Qasidas</h1>
          <p className="text-muted mt-2">Manage qasidas, audio, and wirds</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`${siteRoutes.qasidas}/settings`}>
            <Button variant="secondary" leftIcon={<Settings size={18} />}>
              Settings
            </Button>
          </Link>
          <Link to={`${siteRoutes.qasidas}/new`}>
            <Button variant="primary" leftIcon={<Plus size={20} />}>
              Add Qasida
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-10">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Search
        </label>
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <QasidasTable
            qasidas={data}
            total={pagination.total}
            onToggleEnabled={handleToggleEnabled}
            onDelete={handleDelete}
          />
          <Pagination meta={pagination} onPageChange={handlePageChange} />
        </>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Qasidas Found"
          slogan="Create your first qasida or adjust search"
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center mt-6"
        />
      )}
    </div>
  );
};

export default QasidasListPage;

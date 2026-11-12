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

type ReviewTab = "approved" | "pending" | "rejected";

const TABS: { id: ReviewTab; label: string; title: string; empty: string }[] = [
  {
    id: "approved",
    label: "Public",
    title: "Public qasidas",
    empty: "No public qasidas in this search",
  },
  {
    id: "pending",
    label: "Pending",
    title: "Waiting for review",
    empty: "No qasidas waiting for review",
  },
  {
    id: "rejected",
    label: "Rejected",
    title: "Rejected qasidas",
    empty: "No rejected qasidas",
  },
];

const matchesTab = (item: Qasida, reviewTab: ReviewTab) => {
  if (reviewTab === "pending") return item.reviewStatus === "pending";
  if (reviewTab === "rejected") return item.reviewStatus === "rejected";
  return item.reviewStatus !== "pending" && item.reviewStatus !== "rejected";
};

const QasidasListPage = () => {
  const { listQasidas, updateQasida, deleteQasida, approveQasida, rejectQasida } =
    useQasidas();
  const { isLoading } = useStore();
  const [data, setData] = useState<Qasida[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ReviewTab>("approved");
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);

  const debouncedSearch = useDebounce(search, 500);
  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];
  const visible = data.filter((item) => matchesTab(item, tab));
  const serverFiltered = visible.length === data.length;

  const load = useCallback(
    (page = 1, searchTerm = debouncedSearch) => {
      listQasidas(
        {
          page,
          limit: pagination.limit,
          search: searchTerm || undefined,
          reviewStatus: tab,
        },
        setData,
        setPagination,
      );
    },
    [listQasidas, pagination.limit, debouncedSearch, tab],
  );

  useEffect(() => {
    load(1);
  }, [debouncedSearch, tab]);

  const handlePageChange = (page: number) => {
    load(page);
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const formData = new FormData();
    formData.append("isEnabled", enabled ? "true" : "false");
    const ok = await updateQasida(id, formData);
    if (ok) load(pagination.page);
  };

  const handleReject = async (id: string) => {
    const result = await confirmationPopup(
      "Reject this qasida?",
      "It stays on the user’s personal list and will not appear in the public qasida API.",
    );
    if (!result.isConfirmed) return;
    const ok = await rejectQasida(id);
    if (ok) load(pagination.page);
  };

  const handleApprove = async (id: string) => {
    const result = await confirmationPopup(
      "Approve this qasida?",
      "It will leave the user's private list and appear in the public qasida API for everyone.",
    );
    if (!result.isConfirmed) return;
    const ok = await approveQasida(id);
    if (ok) load(pagination.page);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Delete this qasida? All verses and audio will be removed.",
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
          <p className="text-muted mt-2">Manage qasidas, audio, and verses</p>
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

      <div className="flex gap-2 mt-8 border-b border-gray-200">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setData([]);
              setPagination(defaultPagination);
              setTab(item.id);
            }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
              tab === item.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
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

      {visible.length > 0 ? (
        <>
          <QasidasTable
            qasidas={visible}
            total={serverFiltered ? pagination.total : visible.length}
            title={activeTab.title}
            onToggleEnabled={handleToggleEnabled}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          {serverFiltered && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Qasidas Found"
          slogan={activeTab.empty}
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center mt-6"
        />
      )}
    </div>
  );
};

export default QasidasListPage;

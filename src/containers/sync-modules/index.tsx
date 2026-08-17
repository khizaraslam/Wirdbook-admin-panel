import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw, Trash2, Database, Upload, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import {
  confirmationPopup,
  errorToaster,
} from "@/utils/helpers/common/alert-service";
import {
  SyncModuleDTO,
  canDownloadSyncModule,
  getSyncModuleLabel,
  supportsJsonUpload,
} from "@/utils/helpers/models/sync/sync-module.dto";
import useSyncModules from "./useHooks";

const formatSyncTime = (syncTime: string | null) => {
  if (!syncTime) return "Never synced";
  const parsed = new Date(syncTime);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";
  return parsed.toLocaleString();
};

const SyncModules = () => {
  const { isLoading } = useStore();
  const { getAllModules, updateModuleTime, deleteModule, downloadModule } =
    useSyncModules();
  const [data, setData] = useState<SyncModuleDTO[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadModuleIdRef = useRef<string | null>(null);

  useEffect(() => {
    getAllModules(setData);
  }, []);

  const setModuleLoading = (id: string, value: boolean) => {
    setActionLoading((prev) => ({ ...prev, [id]: value }));
  };

  const applyModuleUpdate = (moduleId: string, updatedModule: SyncModuleDTO) => {
    setData((prev) =>
      prev.map((module) =>
        module.id === moduleId ? { ...module, ...updatedModule } : module,
      ),
    );
  };

  const handleSync = async (moduleId: string) => {
    setModuleLoading(moduleId, true);
    const updatedModule = await updateModuleTime(moduleId);
    if (updatedModule) {
      applyModuleUpdate(moduleId, updatedModule);
    }
    setModuleLoading(moduleId, false);
  };

  const handleUploadClick = (moduleId: string) => {
    uploadModuleIdRef.current = moduleId;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const moduleId = uploadModuleIdRef.current;
    event.target.value = "";
    uploadModuleIdRef.current = null;

    if (!file || !moduleId) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      errorToaster("Please select a .json file");
      return;
    }

    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errorToaster("File must be 50MB or smaller");
      return;
    }

    let fileContent: string;
    try {
      fileContent = await file.text();
      JSON.parse(fileContent);
    } catch {
      errorToaster("Selected file is not valid JSON");
      return;
    }

    const uploadFile = new File([fileContent], file.name, {
      type: "application/json",
    });

    setModuleLoading(moduleId, true);
    const updatedModule = await updateModuleTime(moduleId, uploadFile);
    if (updatedModule) {
      applyModuleUpdate(moduleId, updatedModule);
    }
    setModuleLoading(moduleId, false);
  };

  const handleDownload = async (module: SyncModuleDTO) => {
    setModuleLoading(module.id, true);
    await downloadModule(module.id, module.name);
    setModuleLoading(module.id, false);
  };

  const handleDelete = async (moduleId: string) => {
    const result = await confirmationPopup(
      "Are you sure you want to delete this sync module?",
    );

    if (!result.isConfirmed) return;

    setModuleLoading(moduleId, true);
    const deletedModule = await deleteModule(moduleId);
    if (deletedModule) {
      setData((prev) => prev.filter((module) => module.id !== moduleId));
    }
    setModuleLoading(moduleId, false);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Sync Modules</h1>
          <p className="text-muted mt-2">
            Manage module sync timestamps for app cache invalidation
          </p>
        </div>
      </div>

      <div className="bg-primary-light rounded-2xl p-8 mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
        <p className="text-muted mb-6">Current module sync status</p>
        <div className="flex items-center gap-2 text-gray-700 font-medium bg-white/50 w-fit px-4 py-2 rounded-lg border border-primary/10">
          <Database size={18} className="text-primary" />
          <span>{data.length} total modules</span>
        </div>
      </div>

      <div className="mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Modules</h2>
        <p className="text-muted">
          Bump sync time, upload JSON for supported modules, or delete an entry
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {data.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-sm font-semibold text-gray-700">
            <div className="col-span-3">Module</div>
            <div className="col-span-5">Last Sync Time</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          {data.map((module) => (
            <div
              key={module.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 last:border-b-0 items-center"
            >
              <div className="col-span-3">
                <p className="font-medium text-gray-900">
                  {getSyncModuleLabel(module.name)}
                </p>
                <p className="text-xs text-muted mt-0.5">{module.name}</p>
              </div>
              <div className="col-span-5 text-sm text-muted">
                {formatSyncTime(module.sync_time)}
              </div>
              <div className="col-span-4 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCcw size={14} />}
                  isLoading={!!actionLoading[module.id]}
                  onClick={() => handleSync(module.id)}
                  className="rounded-md"
                >
                  Sync
                </Button>
                {canDownloadSyncModule(module) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    isLoading={!!actionLoading[module.id]}
                    className="rounded-md"
                    onClick={() => handleDownload(module)}
                  >
                    Download
                  </Button>
                )}
                {supportsJsonUpload(module.name) && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Upload size={14} />}
                    isLoading={!!actionLoading[module.id]}
                    onClick={() => handleUploadClick(module.id)}
                    className="rounded-md"
                  >
                    Upload JSON
                  </Button>
                )}
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  isLoading={!!actionLoading[module.id]}
                  onClick={() => handleDelete(module.id)}
                  className="rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Sync Modules"
          slogan="No module entries are available"
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center"
        />
      )}
    </div>
  );
};

export default SyncModules;


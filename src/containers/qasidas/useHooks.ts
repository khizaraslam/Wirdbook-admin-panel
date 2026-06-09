import { useCallback } from "react";
import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { Qasidas_APIS } from "@/libs/apis/qasidas.api";
import type {
  Pagination,
  Qasida,
  QasidaSettings,
  QasidaWird,
  WirdFormBody,
} from "@/utils/helpers/models/qasidas/qasida.dto";

const useQasidas = () => {
  const getSettings = useCallback(async (): Promise<QasidaSettings | null> => {
    const response = await Qasidas_APIS.getSettings();
    const { success = false, data = null } = response || {};
    return success ? (data as QasidaSettings) : null;
  }, []);

  const updateSettings = useCallback(
    async (body: {
      titleEn?: string;
      titleAr?: string;
      infoEn?: string;
      infoAr?: string;
    }) => {
      const response = await Qasidas_APIS.updateSettings(body);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Settings updated successfully");
        return true;
      }
      errorToaster(message || "Failed to update settings");
      return false;
    },
    [],
  );

  const listQasidas = useCallback(
    async (
      params: { page?: number; limit?: number; search?: string },
      setData: (data: Qasida[]) => void,
      setPagination: (p: Pagination) => void,
    ) => {
      const response = await Qasidas_APIS.list(params);
      const { success = false, data = null, pagination = null } = response || {};
      if (success && data && pagination) {
        setData(data as Qasida[]);
        setPagination(pagination as Pagination);
      }
    },
    [],
  );

  const getQasida = useCallback(async (id: string): Promise<Qasida | null> => {
    const response = await Qasidas_APIS.getOne(id);
    const { success = false, data = null } = response || {};
    return success ? (data as Qasida) : null;
  }, []);

  const createQasida = useCallback(async (body: FormData): Promise<Qasida | null> => {
    const response = await Qasidas_APIS.create(body);
    const { success = false, data = null, message = "" } = response || {};
    if (success) {
      successToaster(message || "Qasida created successfully");
      return data as Qasida;
    }
    errorToaster(message || "Failed to create qasida");
    return null;
  }, []);

  const updateQasida = useCallback(async (id: string, body: FormData) => {
    const response = await Qasidas_APIS.update(id, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Qasida updated successfully");
      return true;
    }
    errorToaster(message || "Failed to update qasida");
    return false;
  }, []);

  const deleteQasida = useCallback(async (id: string) => {
    const response = await Qasidas_APIS.remove(id);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Qasida deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete qasida");
    return false;
  }, []);

  const listWirds = useCallback(
    async (
      qasidaId: string,
      params: { page?: number; limit?: number },
      setData: (data: QasidaWird[]) => void,
      setPagination: (p: Pagination) => void,
    ) => {
      const response = await Qasidas_APIS.listWirds(qasidaId, params);
      const { success = false, data = null, pagination = null } = response || {};
      if (success && data && pagination) {
        setData(data as QasidaWird[]);
        setPagination(pagination as Pagination);
      }
    },
    [],
  );

  const createWird = useCallback(async (qasidaId: string, body: WirdFormBody) => {
    const response = await Qasidas_APIS.createWird(qasidaId, body);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Wird added successfully");
      return true;
    }
    errorToaster(message || "Failed to add wird");
    return false;
  }, []);

  const updateWird = useCallback(
    async (qasidaId: string, wirdId: string, body: WirdFormBody) => {
      const response = await Qasidas_APIS.updateWird(qasidaId, wirdId, body);
      const { success = false, message = "" } = response || {};
      if (success) {
        successToaster(message || "Wird updated successfully");
        return true;
      }
      errorToaster(message || "Failed to update wird");
      return false;
    },
    [],
  );

  const deleteWird = useCallback(async (qasidaId: string, wirdId: string) => {
    const response = await Qasidas_APIS.removeWird(qasidaId, wirdId);
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Wird deleted successfully");
      return true;
    }
    errorToaster(message || "Failed to delete wird");
    return false;
  }, []);

  return {
    getSettings,
    updateSettings,
    listQasidas,
    getQasida,
    createQasida,
    updateQasida,
    deleteQasida,
    listWirds,
    createWird,
    updateWird,
    deleteWird,
  };
};

export default useQasidas;

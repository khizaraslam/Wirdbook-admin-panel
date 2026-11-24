import React from "react";
import AdminAction from "@/components/ui/AdminAction";
import { Navigate, Route, Routes } from "react-router-dom";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import QasidasListPage from "./pages/QasidasListPage";
import QasidasSettingsPage from "./pages/QasidasSettingsPage";
import QasidaNewPage from "./pages/QasidaNewPage";
import QasidaEditPage from "./pages/QasidaEditPage";

const Qasidas = () => {
  return (
    <Routes>
      <Route index element={<QasidasListPage />} />
      <Route
        path="settings"
        element={
          <AdminAction
            action="edit"
            fallback={<Navigate to={siteRoutes.qasidas} replace />}
          >
            <QasidasSettingsPage />
          </AdminAction>
        }
      />
      <Route
        path="new"
        element={
          <AdminAction
            action="create"
            fallback={<Navigate to={siteRoutes.qasidas} replace />}
          >
            <QasidaNewPage />
          </AdminAction>
        }
      />
      <Route path=":id/edit" element={<QasidaEditPage />} />
    </Routes>
  );
};

export default Qasidas;

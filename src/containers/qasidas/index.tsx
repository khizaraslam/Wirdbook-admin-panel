import React from "react";
import { Route, Routes } from "react-router-dom";
import QasidasListPage from "./pages/QasidasListPage";
import QasidasSettingsPage from "./pages/QasidasSettingsPage";
import QasidaNewPage from "./pages/QasidaNewPage";
import QasidaEditPage from "./pages/QasidaEditPage";

const Qasidas = () => {
  return (
    <Routes>
      <Route index element={<QasidasListPage />} />
      <Route path="settings" element={<QasidasSettingsPage />} />
      <Route path="new" element={<QasidaNewPage />} />
      <Route path=":id/edit" element={<QasidaEditPage />} />
    </Routes>
  );
};

export default Qasidas;

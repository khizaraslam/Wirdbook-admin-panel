import React from "react";
import { Route, Routes } from "react-router-dom";
import CommunitiesListPage from "./pages/CommunitiesListPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";

const Communities = () => {
  return (
    <Routes>
      <Route index element={<CommunitiesListPage />} />
      <Route path=":id" element={<CommunityDetailPage />} />
    </Routes>
  );
};

export default Communities;

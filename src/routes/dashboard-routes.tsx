import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/components/layouts/main-layout";
import Dashboard from "@/containers/dashboard";
import Tabs from "@/containers/tabs";
import Lectures from "@/containers/lectures";
import Qa from "@/containers/qa";
import Banners from "@/containers/banners";
import IslamicHighlights from "@/containers/islamic-highlights";
import HijriEvents from "@/containers/hijri-events";
import SyncModules from "@/containers/sync-modules";
import Books from "@/containers/books";
import Qasidas from "@/containers/qasidas";
import Communities from "@/containers/communities";
import DhikrTypes from "@/containers/dhikr-types";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

const DashboardRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={siteRoutes.home} element={<Navigate to={siteRoutes.dashboard} replace />} />
        <Route path={siteRoutes.dashboard} element={<Dashboard />} />
        <Route path={siteRoutes.tabs} element={<Tabs />} />
        <Route path={siteRoutes.lectures} element={<Lectures />} />
        <Route path={siteRoutes.qa} element={<Qa />} />
        <Route path={siteRoutes.banners} element={<Banners />} />
        <Route
          path={siteRoutes.islamicHighlights}
          element={<IslamicHighlights />}
        />
        <Route path={siteRoutes.hijriEvents} element={<HijriEvents />} />
        <Route path={siteRoutes.syncModules} element={<SyncModules />} />
        <Route path={siteRoutes.books} element={<Books />} />
        <Route path={`${siteRoutes.qasidas}/*`} element={<Qasidas />} />
        <Route
          path={`${siteRoutes.communities}/*`}
          element={<Communities />}
        />
        <Route path={siteRoutes.dhikrTypes} element={<DhikrTypes />} />
        <Route path="*" element={<Navigate to={siteRoutes.dashboard} replace />} />
      </Routes>
    </MainLayout>
  );
};

export default DashboardRoutes;

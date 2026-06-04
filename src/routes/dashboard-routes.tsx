import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/components/layouts/main-layout";
import Dashboard from "@/containers/dashboard";
import Tabs from "@/containers/tabs";
import Lectures from "@/containers/lectures";
import Qa from "@/containers/qa";
import Banners from "@/containers/banners";
import HijriEvents from "@/containers/hijri-events";
import SyncModules from "@/containers/sync-modules";
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
        <Route path={siteRoutes.hijriEvents} element={<HijriEvents />} />
        <Route path={siteRoutes.syncModules} element={<SyncModules />} />
        <Route path="*" element={<Navigate to={siteRoutes.dashboard} replace />} />
      </Routes>
    </MainLayout>
  );
};

export default DashboardRoutes;

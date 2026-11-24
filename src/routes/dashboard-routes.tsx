import { useEffect, useState, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/components/layouts/main-layout";
import Button from "@/components/ui/Button";
import Dashboard from "@/containers/dashboard";
import Tabs from "@/containers/tabs";
import Lectures from "@/containers/lectures";
import Qa from "@/containers/qa";
import Banners from "@/containers/banners";
import IslamicStories from "@/containers/islamic-stories";
import IslamicHighlights from "@/containers/islamic-highlights";
import HijriEvents from "@/containers/hijri-events";
import SyncModules from "@/containers/sync-modules";
import Books from "@/containers/books";
import Qasidas from "@/containers/qasidas";
import Communities from "@/containers/communities";
import DhikrTypes from "@/containers/dhikr-types";
import Notifications from "@/containers/notifications";
import AdminAccess from "@/containers/admin-access";
import {
  AdminAccessApi,
  AdminAccessApiError,
} from "@/libs/apis/admin-access.api";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/sharedSlice";
import {
  canAccessAdminRoute,
  adminRouteActions,
  type AdminProfile,
} from "@/utils/helpers/admin-access";
import { AdminActionContext } from "@/utils/helpers/admin-action-context";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

const sections: {
  path: siteRoutes;
  element: ReactElement;
  nested?: boolean;
}[] = [
  { path: siteRoutes.dashboard, element: <Dashboard /> },
  { path: siteRoutes.lectures, element: <Lectures /> },
  { path: siteRoutes.tabs, element: <Tabs /> },
  { path: siteRoutes.banners, element: <Banners /> },
  { path: siteRoutes.islamicHighlights, element: <IslamicHighlights /> },
  { path: siteRoutes.islamicStories, element: <IslamicStories /> },
  { path: siteRoutes.hijriEvents, element: <HijriEvents /> },
  { path: siteRoutes.syncModules, element: <SyncModules /> },
  { path: siteRoutes.books, element: <Books /> },
  { path: siteRoutes.qasidas, element: <Qasidas />, nested: true },
  { path: siteRoutes.communities, element: <Communities />, nested: true },
  { path: siteRoutes.qa, element: <Qa /> },
  { path: siteRoutes.dhikrTypes, element: <DhikrTypes /> },
  { path: siteRoutes.notifications, element: <Notifications /> },
  { path: siteRoutes.adminAccess, element: <AdminAccess /> },
];

export default function DashboardRoutes() {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    AdminAccessApi.me()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof AdminAccessApiError && error.status === 401) {
          dispatch(logout());
          return;
        }
        setError(
          error instanceof Error
            ? error.message
            : "Could not load admin access.",
        );
      });
    return () => {
      active = false;
    };
  }, [dispatch, revision]);

  if (!profile) {
    return (
      <main className="grid min-h-screen place-content-center bg-slate-50 p-6">
        {error ? (
          <div className="space-y-3 text-center">
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setError("");
                setRevision((current) => current + 1);
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <p role="status" className="text-sm text-gray-600">
            Loading admin access…
          </p>
        )}
      </main>
    );
  }

  const firstAvailable = sections.find(({ path }) =>
    canAccessAdminRoute(profile, path),
  )?.path;
  const home = firstAvailable ? (
    <Navigate to={firstAvailable} replace />
  ) : (
    <p className="rounded-xl bg-white p-6 text-gray-700">
      No modules have been assigned to your account.
    </p>
  );
  const denied = (
    <p role="alert" className="rounded-xl bg-white p-6 text-gray-700">
      You don’t have access to this module.
    </p>
  );

  return (
    <MainLayout profile={profile}>
      <Routes>
        <Route path="/" element={home} />
        {sections.map(({ path, element, nested }) => (
          <Route
            key={path}
            path={nested ? `${path}/*` : path}
            element={
              !canAccessAdminRoute(profile, path) ? (
                path === siteRoutes.dashboard ? home : denied
              ) : (
                <AdminActionContext.Provider
                  value={adminRouteActions(profile, path)}
                >
                  {element}
                </AdminActionContext.Provider>
              )
            }
          />
        ))}
        <Route path="*" element={home} />
      </Routes>
    </MainLayout>
  );
}

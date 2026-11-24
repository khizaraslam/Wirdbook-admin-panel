import React, { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  canAccessAdminRoute,
  type AdminProfile,
} from "@/utils/helpers/admin-access";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import {
  Home,
  BookOpen,
  BookOpenText,
  ImageIcon,
  Sparkles,
  Calendar,
  RefreshCcw,
  Library,
  Music2,
  Users,
  ShieldCheck,
  Bell,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  profile: AdminProfile;
}

interface MenuItem {
  text: string;
  path: siteRoutes;
  icon: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children, profile }) => {
  const location = useLocation();
  const isSidebarExpanded = useAppSelector(
    (state) => state.sharedReducer?.isSidebarExpanded ?? true,
  );

  // Menu items with Lucide icons
  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      path: siteRoutes.dashboard,
      icon: <Home size={20} />,
    },
    {
      text: "Lectures",
      path: siteRoutes.lectures,
      icon: <BookOpen size={20} />,
    },
    {
      text: "Banners",
      path: siteRoutes.banners,
      icon: <ImageIcon size={20} />,
    },
    {
      text: "Islamic Highlights",
      path: siteRoutes.islamicHighlights,
      icon: <Sparkles size={20} />,
    },
    {
      text: "Islamic Stories",
      path: siteRoutes.islamicStories,
      icon: <BookOpenText size={20} />,
    },
    {
      text: "Hijri Calendar",
      path: siteRoutes.hijriEvents,
      icon: <Calendar size={20} />,
    },
    {
      text: "Sync Modules",
      path: siteRoutes.syncModules,
      icon: <RefreshCcw size={20} />,
    },
    {
      text: "Books",
      path: siteRoutes.books,
      icon: <Library size={20} />,
    },
    {
      text: "Qasidas",
      path: siteRoutes.qasidas,
      icon: <Music2 size={20} />,
    },
    {
      text: "Communities",
      path: siteRoutes.communities,
      icon: <Users size={20} />,
    },
    {
      text: "Notifications",
      path: siteRoutes.notifications,
      icon: <Bell size={20} />,
    },
    {
      text: "Admin Access",
      path: siteRoutes.adminAccess,
      icon: <ShieldCheck size={20} />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    if (path === "/lectures") {
      return (
        location.pathname.startsWith("/lectures") ||
        location.pathname.startsWith("/tabs")
      );
    }
    if (path === "/qasidas") {
      return location.pathname.startsWith("/qasidas");
    }
    if (path === "/communities") {
      return (
        location.pathname.startsWith("/communities") ||
        location.pathname.startsWith("/dhikr-types") ||
        location.pathname === "/qa" ||
        location.pathname.startsWith("/qa/")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-slate-50 flex">
      <Sidebar>
        {menuItems
          .filter(({ path }) => canAccessAdminRoute(profile, path))
          .map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`group flex items-center gap-3 my-1.5 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted hover:bg-primary-light hover:text-primary"
                }`}
              >
                <span
                  className={`transition-transform duration-200 ${
                    isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-medium transition-opacity duration-200 ${
                    isSidebarExpanded ? "opacity-100" : "opacity-0 md:opacity-0"
                  }`}
                >
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar profile={profile} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

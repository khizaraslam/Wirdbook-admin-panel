import React, { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import {
  Home,
  LayoutGrid,
  BookOpen,
  MessageCircleQuestion,
  ImageIcon,
  Sparkles,
  Calendar,
  RefreshCcw,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isSidebarExpanded = useAppSelector(
    (state) => state.sharedReducer?.isSidebarExpanded ?? true,
  );

  // Menu items with Lucide icons
  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
    },
    {
      text: "Tabs",
      path: "/tabs",
      icon: <LayoutGrid size={20} />,
    },
    {
      text: "Lectures",
      path: "/lectures",
      icon: <BookOpen size={20} />,
    },
    {
      text: "Q&A",
      path: "/qa",
      icon: <MessageCircleQuestion size={20} />,
    },
    {
      text: "Banners",
      path: "/banners",
      icon: <ImageIcon size={20} />,
    },
    {
      text: "Islamic Highlights",
      path: "/islamic-highlights",
      icon: <Sparkles size={20} />,
    },
    {
      text: "Hijri Calendar",
      path: "/hijri-events",
      icon: <Calendar size={20} />,
    },
    {
      text: "Sync Modules",
      path: "/sync-modules",
      icon: <RefreshCcw size={20} />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-slate-50 flex">
      <Sidebar>
        {menuItems.map((item, index) => (
          <li key={index}>
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
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

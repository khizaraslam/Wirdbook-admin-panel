import React from "react";
import { NavLink } from "react-router-dom";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

const TABS = [
  { to: siteRoutes.communities, label: "Communities", end: true },
  { to: siteRoutes.dhikrTypes, label: "Dhikr types", end: false },
  { to: siteRoutes.qa, label: "Q&A", end: false },
] as const;

const CommunitiesSectionTabs: React.FC = () => {
  return (
    <div className="mb-6 border-b border-gray-100">
      <div className="flex items-center gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesSectionTabs;

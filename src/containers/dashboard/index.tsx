import React, { FC, useState, useEffect } from "react";
import { BookOpen, FileText } from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import QuickActionCard from "@/components/cards/QuickActionCard";
import { useNavigate } from "react-router-dom";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import useDashboard from "./useHooks";
import { DashboardStatsDTO } from "@/utils/helpers/models/dashboard/dashboard-stats.dto";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { getDashboardStats } = useDashboard();
  const [stats, setStats] = useState<DashboardStatsDTO>(
    new DashboardStatsDTO(),
  );

  useEffect(() => {
    getDashboardStats(setStats);
  }, []);

  return (
    <div className="">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-primary">Welcome Back</h1>
        <p className="text-muted mt-2">
          Manage your lecture categories and content from here
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-10">
        <StatCard
          title="Total Tabs"
          value={stats.totalTabs}
          subtitle="Active categories"
          bgColor="bg-primary-light"
          iconBg="bg-primary"
          icon={<BookOpen size={20} />}
        />

        <StatCard
          title="Total Lectures"
          value={stats.totalLectures}
          subtitle="All content"
          iconBg="bg-secondary"
          icon={<FileText size={20} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Manage Tabs"
            description="Add, edit, reorder lecture categories"
            icon={<BookOpen size={20} />}
            onClick={() => navigate(siteRoutes.tabs)}
          />

          <QuickActionCard
            title="Manage Lectures"
            description="Assign lectures to tabs and organize content"
            icon={<FileText size={20} />}
            onClick={() => navigate(siteRoutes.lectures)}
          />
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-primary-light mt-10 rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-6">💡 Quick Tips</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-primary">Organize with Tabs</h4>
            <p className="text-muted text-sm">
              Create tabs to categorize your lectures by topic, series, or
              speaker
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary">Drag to Reorder</h4>
            <p className="text-muted text-sm">
              In the Tabs page, you can drag and drop to change the order of
              categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

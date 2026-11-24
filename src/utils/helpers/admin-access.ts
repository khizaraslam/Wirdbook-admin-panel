import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

export interface AdminProfile {
  id: string;
  email: string;
  role: "super_admin" | "limited_admin";
  permissions: string[];
  enabled: boolean;
}

export const adminActionLabels = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
} as const;
export type AdminAction = keyof typeof adminActionLabels;
export const adminActions = Object.keys(adminActionLabels) as AdminAction[];

export function canPerformAdminAction(
  profile: AdminProfile,
  module: string,
  action: AdminAction,
): boolean {
  return (
    profile.enabled &&
    (profile.role === "super_admin" ||
      (profile.role === "limited_admin" &&
        (profile.permissions.includes(module) ||
          profile.permissions.includes(`${module}:${action}`))))
  );
}

const routePermissions: Partial<Record<siteRoutes, string>> = {
  [siteRoutes.lectures]: "lectures",
  [siteRoutes.tabs]: "lectures",
  [siteRoutes.banners]: "banners",
  [siteRoutes.islamicHighlights]: "islamic-highlights",
  [siteRoutes.islamicStories]: "islamic-stories",
  [siteRoutes.hijriEvents]: "hijri-events",
  [siteRoutes.books]: "books",
  [siteRoutes.qasidas]: "qasidas",
  [siteRoutes.communities]: "communities",
  [siteRoutes.qa]: "communities",
  [siteRoutes.dhikrTypes]: "communities",
  [siteRoutes.notifications]: "notifications",
};

export function adminRouteActions(
  profile: AdminProfile,
  route: siteRoutes,
): AdminAction[] {
  const module = routePermissions[route];
  return module
    ? adminActions.filter((action) =>
        canPerformAdminAction(profile, module, action),
      )
    : profile.enabled && profile.role === "super_admin"
      ? adminActions
      : [];
}

export function canAccessAdminRoute(
  profile: AdminProfile,
  route: siteRoutes,
): boolean {
  const permission = routePermissions[route];
  return permission
    ? canPerformAdminAction(profile, permission, "view")
    : profile.enabled && profile.role === "super_admin";
}

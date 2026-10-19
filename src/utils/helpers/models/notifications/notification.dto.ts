export interface AdminNotificationDTO {
  id: string;
  title: string;
  body: string;
  event: string;
  audience: "all" | "user";
  userId: string | null;
  user: { id: string; name: string; phone: string | null } | null;
  createdAt: string;
}

export interface SendNotificationPayload {
  title: string;
  body: string;
  userId?: string;
}

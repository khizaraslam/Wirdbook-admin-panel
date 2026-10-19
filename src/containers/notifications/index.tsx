import React, { useEffect, useState } from "react";
import { Bell, Send, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import CustomMessageDisplay from "@/components/data-not-found";
import { AppUsers_APIS, type AppUserOption } from "@/libs/apis/app-users.api";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import type { AdminNotificationDTO } from "@/utils/helpers/models/notifications/notification.dto";
import useNotifications from "./useHooks";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const emptyMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const Notifications = () => {
  const { list, send, remove } = useNotifications();
  const [items, setItems] = useState<AdminNotificationDTO[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "user">("all");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AppUserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = async (page = meta.page) => {
    const result = await list(page, meta.limit);
    setItems(result.items);
    setMeta(result.pagination);
  };

  useEffect(() => {
    load(1);
  }, []);

  useEffect(() => {
    if (audience !== "user") return;
    const handle = window.setTimeout(() => {
      setLoadingUsers(true);
      AppUsers_APIS.list(query.trim() || undefined)
        .then((response) => {
          const data =
            response?.success && Array.isArray(response.data)
              ? response.data
              : [];
          setUsers(data as AppUserOption[]);
        })
        .finally(() => setLoadingUsers(false));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [audience, query]);

  const onSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (audience === "user" && !selectedUserId) {
      setError("Select a user, or send to all users.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const ok = await send({
        title: title.trim(),
        body: body.trim(),
        ...(audience === "user" ? { userId: selectedUserId } : {}),
      });
      if (ok) {
        setTitle("");
        setBody("");
        setSelectedUserId("");
        setQuery("");
        setAudience("all");
        await load(1);
      }
    } finally {
      setSending(false);
    }
  };

  const onDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Remove this notification from the app list?",
    );
    if (!result.isConfirmed) return;
    const ok = await remove(id);
    if (ok) await load(items.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page);
  };

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell size={28} className="text-primary" />
          Notifications
        </h1>
        <p className="text-gray-500 mt-1">
          Send a bulk notification to every user, or to one selected user.
        </p>
      </div>

      <form
        onSubmit={onSend}
        className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-gray-100 space-y-4"
      >
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setAudience("all");
              setSelectedUserId("");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              audience === "all"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            All users
          </button>
          <button
            type="button"
            onClick={() => {
              setAudience("user");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              audience === "user"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            Specific user
          </button>
        </div>

        {audience === "user" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search user
            </label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or phone"
              className="w-full px-3 py-2 mb-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
              {loadingUsers ? (
                <p className="px-3 py-3 text-sm text-gray-500">Loading users…</p>
              ) : users.length === 0 ? (
                <p className="px-3 py-3 text-sm text-gray-500">No users found.</p>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full text-left px-3 py-2 text-sm border-b border-gray-50 last:border-0 ${
                      selectedUserId === user.id
                        ? "bg-primary-light text-primary"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{user.name}</span>
                    {user.phone ? (
                      <span className="text-gray-500"> · {user.phone}</span>
                    ) : null}
                  </button>
                ))
              )}
            </div>
            {selectedUser ? (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedUser.name}
                {selectedUser.phone ? ` (${selectedUser.phone})` : ""}
              </p>
            ) : null}
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="Announcement"
        />
        <div>
          <label className="form-label">Message</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Write the notification message"
            className="form-input w-full"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button
          type="submit"
          variant="primary"
          isLoading={sending}
          leftIcon={<Send size={18} />}
        >
          {audience === "user" ? "Send to selected user" : "Send to all users"}
        </Button>
      </form>

      <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sent notifications</h2>
        {items.length === 0 ? (
          <CustomMessageDisplay
            show
            title="No notifications yet"
            slogan="Sent messages will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Message</th>
                  <th className="py-2 pr-4 font-medium">Audience</th>
                  <th className="py-2 pr-4 font-medium">Sent</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 align-top">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 max-w-md">{item.body}</td>
                    <td className="py-3 pr-4 text-gray-700">
                      {item.audience === "all"
                        ? "All users"
                        : item.user
                          ? `${item.user.name}${item.user.phone ? ` · ${item.user.phone}` : ""}`
                          : "One user"}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Remove notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {meta.totalPages > 1 ? (
          <Pagination
            meta={meta}
            onPageChange={(page) => load(page)}
            className="mt-4"
          />
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;

import React, { useEffect, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import { DAY_OF_WEEK_OPTIONS } from "@/utils/helpers/islamic-highlights/helpers";
import type {
  CampaignScheduleKind,
  NotificationCampaign,
} from "@/libs/apis/notifications.api";
import useNotifications from "../useHooks";

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Shaban",
  "Ramadan",
  "Shawwal",
  "Dhul Qadah",
  "Dhul Hijjah",
];

const NotificationCampaigns = () => {
  const {
    listCampaigns,
    createCampaign,
    pauseCampaign,
    resumeCampaign,
    removeCampaign,
  } = useNotifications();
  const [items, setItems] = useState<NotificationCampaign[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scheduleKind, setScheduleKind] = useState<CampaignScheduleKind>("weekly");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1]);
  const [lunarDays, setLunarDays] = useState("13, 14, 15");
  const [hijriMonth, setHijriMonth] = useState(8);
  const [hijriDay, setHijriDay] = useState(15);
  const [sendTime, setSendTime] = useState("09:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setItems(await listCampaigns());
  };

  useEffect(() => {
    load();
  }, []);

  const toggleDay = (day: number) => {
    setDaysOfWeek((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  };

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !title.trim() || !body.trim()) {
      setError("Name, title, and message are required.");
      return;
    }
    const payload = {
      name: name.trim(),
      title: title.trim(),
      body: body.trim(),
      scheduleKind,
      sendTime,
    };
    if (scheduleKind === "weekly") {
      if (daysOfWeek.length === 0) {
        setError("Pick at least one weekday.");
        return;
      }
      Object.assign(payload, { daysOfWeek });
    }
    if (scheduleKind === "lunar_days") {
      const hijriDays = lunarDays
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((day) => Number.isInteger(day) && day >= 1 && day <= 30);
      if (hijriDays.length === 0) {
        setError("Enter Hijri days like 13, 14, 15.");
        return;
      }
      Object.assign(payload, { hijriDays });
    }
    if (scheduleKind === "hijri") {
      Object.assign(payload, { hijriMonth, hijriDay });
    }
    setError("");
    setSaving(true);
    try {
      const ok = await createCampaign(payload);
      if (ok) {
        setName("");
        setTitle("");
        setBody("");
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const onPause = async (item: NotificationCampaign) => {
    const ok =
      item.status === "paused"
        ? await resumeCampaign(item.id)
        : await pauseCampaign(item.id);
    if (ok) await load();
  };

  const onDelete = async (item: NotificationCampaign) => {
    const result = await confirmationPopup(
      "Delete this campaign?",
      "It will stop sending. Notifications already delivered stay in the app.",
    );
    if (!result.isConfirmed) return;
    const ok = await removeCampaign(item.id);
    if (ok) await load();
  };

  return (
    <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900">Campaigns</h2>
      <p className="text-sm text-gray-500 mt-1">
        Each phone gets the notification once, at its own local time. A phone
        with no timezone gets that one send at UTC. Pause stops future sends.
      </p>

      <form onSubmit={onCreate} className="space-y-4 mt-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["weekly", "Every week"],
              ["lunar_days", "Lunar days"],
              ["hijri", "Hijri date"],
            ] as const
          ).map(([kind, label]) => (
            <button
              key={kind}
              type="button"
              onClick={() => {
                setScheduleKind(kind);
                setError("");
                if (kind === "hijri") setSendTime("00:00");
                if (kind === "weekly") setSendTime("09:00");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                scheduleKind === kind
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {scheduleKind === "weekly" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DAY_OF_WEEK_OPTIONS.map((day) => {
              const checked = daysOfWeek.includes(day.value);
              return (
                <label
                  key={day.value}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                    checked
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDay(day.value)}
                  />
                  {day.label}
                </label>
              );
            })}
          </div>
        )}

        {scheduleKind === "lunar_days" && (
          <div>
            <Input
              label="Hijri days of every month"
              value={lunarDays}
              onChange={(event) => setLunarDays(event.target.value)}
              placeholder="13, 14, 15"
            />
            <button
              type="button"
              className="mt-2 text-sm text-primary font-medium"
              onClick={() => setLunarDays("13, 14, 15")}
            >
              Use 13, 14, 15
            </button>
          </div>
        )}

        {scheduleKind === "hijri" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Hijri month</label>
              <select
                value={hijriMonth}
                onChange={(event) => setHijriMonth(Number(event.target.value))}
                className="form-input w-full"
              >
                {HIJRI_MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {index + 1}. {month}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Hijri day"
              type="number"
              min={1}
              max={30}
              value={String(hijriDay)}
              onChange={(event) => setHijriDay(Number(event.target.value))}
            />
            <button
              type="button"
              className="text-sm text-primary font-medium text-left"
              onClick={() => {
                setHijriMonth(8);
                setHijriDay(15);
                setSendTime("00:00");
              }}
            >
              Midnight of 15 Shaban
            </button>
          </div>
        )}

        <Input
          label="Time on the user's phone"
          type="time"
          value={sendTime}
          onChange={(event) => setSendTime(event.target.value)}
        />
        <Input
          label="Campaign name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={120}
          placeholder="White days"
        />
        <Input
          label="Notification title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="Ayyam al-Beed"
        />
        <div>
          <label className="form-label">Message</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Write the notification message"
            className="form-input w-full"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" variant="primary" isLoading={saving}>
          Create campaign
        </Button>
      </form>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No campaigns yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-100 rounded-xl p-4 flex flex-wrap items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                      item.status === "paused"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {item.status === "paused" ? "Paused" : "Active"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.scheduleLabel}</p>
                <p className="text-sm text-gray-800 mt-2">{item.title}</p>
                <p className="text-sm text-gray-600">{item.body}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPause(item)}
                  className="p-2 border border-gray-200 rounded-lg text-gray-700"
                  title={item.status === "paused" ? "Resume" : "Pause"}
                >
                  {item.status === "paused" ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="p-2 border border-gray-200 rounded-lg text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCampaigns;

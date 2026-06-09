export const formatDuration = (ms: number | null | undefined) => {
  if (!ms) return "—";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const getQasidaAudioUrl = (audioUrl: string | null | undefined) => {
  if (!audioUrl) return null;
  if (audioUrl.startsWith("http")) return audioUrl;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${audioUrl}`;
};

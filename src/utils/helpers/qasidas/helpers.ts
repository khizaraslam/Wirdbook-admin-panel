import type {
  Qasida,
  QasidaAudio,
} from "@/utils/helpers/models/qasidas/qasida.dto";

export const formatDuration = (ms: number | null | undefined) => {
  if (!ms) return "—";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const getQasidaAudioUrl = (audioUrl: string | null | undefined) => {
  if (!audioUrl) return null;
  if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) {
    return audioUrl;
  }
  const base = (import.meta.env.VITE_BASE_URL_PREFIX || "").replace(/\/$/, "");
  const path = audioUrl.startsWith("/") ? audioUrl : `/${audioUrl}`;
  return `${base}${path}`;
};

export const getQasidaPlayableAudios = (qasida: Qasida): QasidaAudio[] => {
  if (qasida.audios && qasida.audios.length > 0) {
    return qasida.audios.filter((item) => item.audio_link);
  }

  const fallbackLink = qasida.audioUrl || qasida.audioLink;
  if (!fallbackLink) return [];

  return [
    {
      audio_link: fallbackLink,
      audio_duration: qasida.audioDuration ?? 0,
      audio_key: qasida.audioKey ?? "",
      reciter_name: qasida.singer?.en || "Default",
    },
  ];
};

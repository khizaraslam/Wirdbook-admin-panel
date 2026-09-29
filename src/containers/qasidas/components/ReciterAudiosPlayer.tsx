import React from "react";
import type { Qasida } from "@/utils/helpers/models/qasidas/qasida.dto";
import {
  formatDuration,
  getQasidaAudioUrl,
  getQasidaPlayableAudios,
} from "@/utils/helpers/qasidas/helpers";

interface ReciterAudiosPlayerProps {
  qasida: Qasida;
}

const ReciterAudiosPlayer: React.FC<ReciterAudiosPlayerProps> = ({ qasida }) => {
  const tracks = getQasidaPlayableAudios(qasida);
  const usingFallback = !(qasida.audios && qasida.audios.length > 0);

  if (tracks.length === 0) {
    return (
      <p className="text-sm text-muted bg-white rounded-2xl border border-gray-100 px-5 py-4">
        No playable audio yet. Upload a primary file or add a reciter track.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">Playback</h3>
        <p className="text-xs text-muted mt-0.5">
          {usingFallback
            ? "audios[] is empty — using audioUrl / audioLink"
            : `${tracks.length} reciter ${tracks.length === 1 ? "track" : "tracks"}`}
        </p>
      </div>
      <div className="space-y-3">
        {tracks.map((track, index) => {
          const src = getQasidaAudioUrl(track.audio_link);
          return (
            <div
              key={`${track.audio_key || track.audio_link}-${index}`}
              className="rounded-xl bg-gray-50 px-4 py-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-800">
                  {track.reciter_name || `Track ${index + 1}`}
                </p>
                <p className="text-xs text-muted">
                  {formatDuration(track.audio_duration)}
                </p>
              </div>
              {src ? (
                <audio controls src={src} className="w-full" />
              ) : (
                <p className="text-xs text-red-500">Audio URL is missing</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReciterAudiosPlayer;

import React, { useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Copy, Share2, Music } from "lucide-react";
import type { IslamicHighlightDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight.dto";
import {
  buildShareText,
  formatScheduleLabel,
  getMediaUrl,
} from "@/utils/helpers/islamic-highlights/helpers";
import { successToaster, errorToaster } from "@/utils/helpers/common/alert-service";

interface HighlightPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlight: IslamicHighlightDTO | null;
}

const HighlightPreviewModal: React.FC<HighlightPreviewModalProps> = ({
  isOpen,
  onClose,
  highlight,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!highlight) return null;

  const imageUrl = getMediaUrl(highlight.imageUrl);
  const audioUrl = getMediaUrl(highlight.audioUrl);
  const shareText = buildShareText(highlight);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      successToaster("Copied to clipboard");
    } catch {
      errorToaster("Could not copy text");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Islamic Highlight",
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") copyText();
      }
    } else {
      copyText();
    }
  };

  const typeLabel =
    highlight.messageType.charAt(0).toUpperCase() +
    highlight.messageType.slice(1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Preview highlight"
      className="max-w-2xl max-h-[90vh]"
    >
      <div className="space-y-6 -mt-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-md bg-primary/10 text-primary uppercase">
            {typeLabel}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-md bg-slate-100 text-slate-700">
            {formatScheduleLabel(highlight.schedule)}
          </span>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-md ${
              highlight.enabled
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {highlight.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Highlight"
            className="w-full max-h-64 object-cover rounded-xl border border-gray-100"
          />
        )}

        <div className="space-y-4 p-5 rounded-2xl bg-primary-light/40 border border-primary/10">
          <p className="text-lg font-semibold text-gray-900 leading-relaxed">
            {highlight.message.en || "—"}
          </p>
          <p
            className="text-lg text-gray-700 leading-loose"
            dir="rtl"
          >
            {highlight.message.ar || "—"}
          </p>
          {(highlight.source.en || highlight.source.ar) && (
            <div className="pt-3 border-t border-primary/10 text-sm text-muted">
              {highlight.source.en && <p>{highlight.source.en}</p>}
              {highlight.source.ar && (
                <p dir="rtl" className="mt-1">
                  {highlight.source.ar}
                </p>
              )}
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="flex flex-col gap-2">
            <label className="form-label flex items-center gap-2">
              <Music size={16} className="text-primary" />
              Audio
            </label>
            <audio
              ref={audioRef}
              controls
              src={audioUrl}
              className="w-full"
              preload="metadata"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            leftIcon={<Copy size={16} />}
            onClick={copyText}
          >
            Copy text
          </Button>
          <Button
            type="button"
            variant="outline"
            leftIcon={<Share2 size={16} />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button type="button" variant="primary" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HighlightPreviewModal;

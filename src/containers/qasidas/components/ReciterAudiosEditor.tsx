import React from "react";
import { Plus, Trash2, UploadCloud, X, Music } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SuggestPairInput from "./SuggestPairInput";
import type { LocalizedText } from "@/utils/helpers/models/qasidas/qasida.dto";

export interface ReciterAudioDraft {
  reciter_name: string;
  audio_link: string;
  audio_duration: string;
  audio_key: string;
  file: File | null;
}

export const emptyReciterDraft = (
  defaultName = "",
): ReciterAudioDraft => ({
  reciter_name: defaultName,
  audio_link: "",
  audio_duration: "",
  audio_key: "",
  file: null,
});

interface ReciterAudiosEditorProps {
  items: ReciterAudioDraft[];
  onChange: (items: ReciterAudioDraft[]) => void;
  vocalistOptions?: LocalizedText[];
  defaultVocalistName?: string;
}

const ReciterAudiosEditor: React.FC<ReciterAudiosEditorProps> = ({
  items,
  onChange,
  vocalistOptions = [],
  defaultVocalistName = "",
}) => {
  const updateItem = (index: number, patch: Partial<ReciterAudioDraft>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Vocalist audios</h3>
          <p className="text-xs text-muted mt-0.5">
            Pick an existing vocalist when available, or type a new name. Each
            row is one audio track.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() =>
            onChange([...items, emptyReciterDraft(defaultVocalistName.trim())])
          }
        >
          Add vocalist
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted bg-gray-50 rounded-xl px-4 py-3">
          No vocalist tracks yet. Click Add vocalist to attach audio.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Vocalist {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label="Remove vocalist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SuggestPairInput
                  label="Vocalist"
                  lang="en"
                  value={item.reciter_name}
                  options={vocalistOptions}
                  placeholder="Type to search or add new"
                  hint="Pick an existing vocalist or type a new name"
                  onChange={(v) => updateItem(index, { reciter_name: v })}
                  onSelectPair={(pair) =>
                    updateItem(index, {
                      reciter_name: pair.en || pair.ar || "",
                    })
                  }
                />
                <Input
                  label="Duration (ms)"
                  type="number"
                  min={0}
                  value={item.audio_duration}
                  onChange={(e) =>
                    updateItem(index, { audio_duration: e.target.value })
                  }
                />
              </div>
              <Input
                label="Audio link"
                hint="Optional if you upload a file"
                placeholder="/uploads/qasidas/audios/..."
                value={item.audio_link}
                onChange={(e) =>
                  updateItem(index, { audio_link: e.target.value })
                }
              />
              {!item.file ? (
                <label className="form-input flex items-center justify-between cursor-pointer py-2.5 bg-white hover:bg-gray-50 min-h-[64px]">
                  <span className="text-gray-400 text-sm">
                    Upload vocalist MP3
                  </span>
                  <UploadCloud className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3,.mp3,audio/*"
                    className="hidden"
                    onChange={(e) =>
                      updateItem(index, { file: e.target.files?.[0] ?? null })
                    }
                  />
                </label>
              ) : (
                <div className="form-input flex items-center justify-between py-2 bg-white">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {item.file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateItem(index, { file: null })}
                    className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReciterAudiosEditor;

import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImageIcon, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  IslamicStoriesApi,
  storyImageUrl,
  type StoryDetail,
  type StoryText,
} from "@/libs/apis/islamic-stories.api";

interface ImageDraft {
  id: string | null;
  url: string | null;
  file?: File;
}

interface SegmentDraft {
  key: number;
  text: StoryText;
  image: ImageDraft;
}

const blankText: StoryText = { arabic: "", english: "" };
const blankImage: ImageDraft = { id: null, url: null };
const maxSegments = 200;
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const sectionClass =
  "space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6";

function BilingualFields({
  label,
  value,
  onChange,
  title,
}: {
  label: string;
  value: StoryText;
  onChange: (value: StoryText) => void;
  title?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["english", "arabic"] as const).map((language) => {
        const name = language === "english" ? "English" : "Arabic";
        const props = {
          required: true,
          lang: language === "arabic" ? "ar" : "en",
          dir: language === "arabic" ? "rtl" : "ltr",
          className: inputClass,
          value: value[language],
          onChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => onChange({ ...value, [language]: event.target.value }),
        };
        return (
          <label
            className="space-y-1 text-sm font-medium text-gray-700"
            key={language}
          >
            <span>
              {label} ({name})
            </span>
            {title ? (
              <input {...props} maxLength={255} />
            ) : (
              <textarea {...props} rows={4} />
            )}
          </label>
        );
      })}
    </div>
  );
}

function StoryImageField({
  label,
  image,
  onChange,
}: {
  label: string;
  image: ImageDraft;
  onChange: (value: ImageDraft) => void;
}) {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const src = image.file ? preview : storyImageUrl(image.url);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={20} aria-hidden />
        )}
      </div>
      <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700">
        <span>{label}</span>
        <input
          className="block w-full max-w-xs cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:font-medium"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              onChange({ ...blankImage, file });
            }
            event.currentTarget.value = "";
          }}
        />
      </label>
      {(image.id || image.file) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setPreview("");
            onChange(blankImage);
          }}
        >
          Remove image
        </Button>
      )}
    </div>
  );
}

export default function StoryEditor({
  story,
  onCancel,
  onSaved,
}: {
  story: StoryDetail | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(story?.story_name ?? blankText);
  const [moral, setMoral] = useState(story?.moral ?? blankText);
  const [published, setPublished] = useState(story?.published ?? false);
  const [cover, setCover] = useState<ImageDraft>({
    id: story?.story_image_id ?? null,
    url: story?.story_image ?? null,
  });
  const [segments, setSegments] = useState<SegmentDraft[]>(
    () =>
      story?.segments.map((segment) => ({
        key: segment.index,
        text: { arabic: segment.arabic, english: segment.english },
        image: { id: segment.segment_image_id, url: segment.segment_image },
      })) ?? [{ key: 1, text: blankText, image: blankImage }],
  );
  const [nextKey, setNextKey] = useState(segments.length + 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateSegment(
    key: number,
    fields: Partial<Omit<SegmentDraft, "key">>,
  ) {
    setSegments((current) =>
      current.map((segment) =>
        segment.key === key ? { ...segment, ...fields } : segment,
      ),
    );
  }

  function moveSegment(index: number, direction: -1 | 1) {
    const target = index + direction;
    setSegments((current) =>
      current.map((segment, position) => {
        if (position === index) return current[target];
        if (position === target) return current[index];
        return segment;
      }),
    );
  }

  async function resolveImage(
    image: ImageDraft,
    onUpload: (image: ImageDraft) => void,
  ) {
    if (!image.file) return image.id;
    const uploaded = await IslamicStoriesApi.uploadImage(image.file);
    onUpload(uploaded);
    return uploaded.id;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (published && !cover.id && !cover.file) {
      setError("Add a cover photo before publishing.");
      return;
    }
    const texts = [name, ...segments.map(({ text }) => text), moral];
    if (
      texts.some(({ arabic, english }) => !arabic.trim() || !english.trim())
    ) {
      setError(
        "Fill in both languages for the title, every segment, and the moral.",
      );
      return;
    }

    setSaving(true);
    try {
      const coverId = await resolveImage(cover, setCover);
      const orderedSegments = [];
      for (const segment of segments) {
        const imageId = await resolveImage(segment.image, (image) =>
          updateSegment(segment.key, { image }),
        );
        orderedSegments.push({ ...segment.text, segment_image_id: imageId });
      }
      await IslamicStoriesApi.save(story?.story_id, {
        story_name: name,
        story_image_id: coverId,
        segments: orderedSegments,
        moral,
        published,
      });
      onSaved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save this story.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={onCancel}
          disabled={saving}
        >
          Back to stories
        </Button>
        <h1 className="mt-2 text-3xl font-bold text-primary">
          {story ? "Edit Islamic Story" : "New Islamic Story"}
        </h1>
      </div>
      <form onSubmit={save}>
        <fieldset disabled={saving} className="min-w-0 space-y-5">
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-gray-900">
              Story details
            </h2>
            <BilingualFields
              label="Title"
              value={name}
              onChange={setName}
              title
            />
            <StoryImageField
              label="Cover photo"
              image={cover}
              onChange={setCover}
            />
          </section>
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-gray-900">Segments</h2>
            {segments.map((segment, index) => (
              <div
                key={segment.key}
                className="space-y-4 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    Segment {index + 1}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      aria-label={`Move segment ${index + 1} up`}
                      onClick={() => moveSegment(index, -1)}
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === segments.length - 1}
                      aria-label={`Move segment ${index + 1} down`}
                      onClick={() => moveSegment(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={segments.length === 1}
                      className="text-red-600"
                      aria-label={`Remove segment ${index + 1}`}
                      onClick={() =>
                        setSegments((current) =>
                          current.filter(({ key }) => key !== segment.key),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <BilingualFields
                  label="Text"
                  value={segment.text}
                  onChange={(text) => updateSegment(segment.key, { text })}
                />
                <StoryImageField
                  label="Segment image (optional)"
                  image={segment.image}
                  onChange={(image) => updateSegment(segment.key, { image })}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              leftIcon={<Plus size={16} />}
              disabled={segments.length >= maxSegments}
              onClick={() => {
                setSegments((current) => [
                  ...current,
                  { key: nextKey, text: blankText, image: blankImage },
                ]);
                setNextKey(nextKey + 1);
              }}
            >
              Add segment
            </Button>
          </section>
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-gray-900">Moral</h2>
            <BilingualFields label="Moral" value={moral} onChange={setMoral} />
          </section>
        </fieldset>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={published}
              disabled={saving}
              onChange={(event) => setPublished(event.target.checked)}
              className="mt-1 accent-primary"
            />
            <span>
              <span className="block font-semibold text-gray-900">
                Published
              </span>
              Visible in the mobile app. A cover photo is required.
            </span>
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={saving}>
              Save story
            </Button>
          </div>
          {error && (
            <p role="alert" className="w-full text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

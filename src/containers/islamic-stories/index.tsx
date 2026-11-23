import { useEffect, useState } from "react";
import { ImageIcon, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  IslamicStoriesApi,
  storyImageUrl,
  type StoryDetail,
  type StorySummary,
} from "@/libs/apis/islamic-stories.api";
import {
  confirmationPopup,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import StoryEditor from "./StoryEditor";

const pageSize = 20;

export default function IslamicStories() {
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof IslamicStoriesApi.list>
  > | null>(null);
  const [editor, setEditor] = useState<{ story: StoryDetail | null } | null>(
    null,
  );
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [listFailed, setListFailed] = useState(false);

  useEffect(() => {
    let active = true;
    IslamicStoriesApi.list(page, pageSize)
      .then((data) => {
        if (!active) return;
        const lastPage = Math.max(1, Math.ceil(data.total / pageSize));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setResult(data);
      })
      .catch((error: Error) => {
        if (!active) return;
        setError(error.message);
        setListFailed(true);
      });
    return () => {
      active = false;
    };
  }, [page, revision]);

  function reload() {
    setListFailed(false);
    setError("");
    setResult(null);
    setRevision((current) => current + 1);
  }

  function changePage(next: number) {
    setError("");
    setListFailed(false);
    setResult(null);
    setPage(next);
  }

  async function edit(story: StorySummary) {
    setBusyId(story.story_id);
    setError("");
    try {
      const detail = await IslamicStoriesApi.get(story.story_id);
      setEditor({ story: detail });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not open this story.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function remove(story: StorySummary) {
    setBusyId(story.story_id);
    setError("");
    try {
      const result = await confirmationPopup(
        "Delete Islamic story?",
        `“${story.story_name.english}” and all of its segments will be deleted.`,
      );
      if (!result.isConfirmed) return;
      await IslamicStoriesApi.remove(story.story_id);
      successToaster("Story deleted.");
      reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete this story.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (editor) {
    return (
      <StoryEditor
        story={editor.story}
        onCancel={() => setEditor(null)}
        onSaved={() => {
          successToaster("Story saved.");
          setEditor(null);
          if (!editor.story && page !== 1) changePage(1);
          else reload();
        }}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / pageSize));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Islamic Stories
        </h1>
        <Button
          type="button"
          leftIcon={<Plus size={18} />}
          disabled={busyId !== null}
          onClick={() => setEditor({ story: null })}
        >
          Add story
        </Button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {listFailed ? (
          <div className="px-6 py-8 text-center">
            <Button type="button" variant="secondary" onClick={reload}>
              Retry
            </Button>
          </div>
        ) : !result ? (
          <p
            role="status"
            className="px-6 py-8 text-center text-sm text-gray-500"
          >
            Loading stories…
          </p>
        ) : result.items.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            No stories yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Cover
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Story
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.items.map((story) => (
                    <tr key={story.story_id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
                          {story.story_image ? (
                            <img
                              src={storyImageUrl(story.story_image)}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} aria-hidden />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-900">
                          {story.story_name.english}
                        </div>
                        <div
                          lang="ar"
                          dir="rtl"
                          className="mt-1 w-fit text-sm text-gray-600"
                        >
                          {story.story_name.arabic}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            story.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {story.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busyId !== null}
                          aria-label={`Edit ${story.story_name.english}`}
                          onClick={() => void edit(story)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busyId !== null}
                          aria-label={`Delete ${story.story_name.english}`}
                          className="text-red-600"
                          onClick={() => void remove(story)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages} · {result.total} stories
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page === 1 || busyId !== null}
                  onClick={() => changePage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages || busyId !== null}
                  onClick={() => changePage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

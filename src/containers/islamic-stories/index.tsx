import { useEffect, useState, type FormEvent } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  IslamicStoriesApi,
  type StoryDetail,
  type StorySummary,
} from "@/libs/apis/islamic-stories.api";
import {
  confirmationPopup,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import StoryEditor from "./StoryEditor";
import SortableStoryRow from "./SortableStoryRow";

const pageSize = 20;

export default function IslamicStories() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  const [stories, setStories] = useState<StorySummary[] | null>(null);
  const [expectedIds, setExpectedIds] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editor, setEditor] = useState<{ story: StoryDetail | null } | null>(
    null,
  );
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [listFailed, setListFailed] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    let active = true;
    IslamicStoriesApi.listOrder(query)
      .then((items) => {
        if (!active) return;
        setStories(items);
        setExpectedIds(items.map(({ story_id }) => story_id));
        setPage((current) =>
          Math.min(current, Math.max(1, Math.ceil(items.length / pageSize))),
        );
      })
      .catch((error: Error) => {
        if (!active) return;
        setError(error.message);
        setListFailed(true);
      });
    return () => {
      active = false;
    };
  }, [query, revision]);

  const ids = stories?.map(({ story_id }) => story_id) ?? [];
  const searching = Boolean(query);
  const orderChanged = ids.some((id, index) => id !== expectedIds[index]);
  const busy = busyId !== null || savingOrder;
  const actionsDisabled = busy || orderChanged;
  const totalPages = Math.max(1, Math.ceil(ids.length / pageSize));
  const offset = showAll ? 0 : (page - 1) * pageSize;
  const visible = showAll
    ? (stories ?? [])
    : (stories?.slice(offset, offset + pageSize) ?? []);

  function reload() {
    setListFailed(false);
    setError("");
    setStories(null);
    setRevision((current) => current + 1);
  }

  function changeSearch(value: string) {
    const next = value.trim();
    if (next === query) return;
    setQuery(next);
    setPage(1);
    reload();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changeSearch(searchInput);
  }

  function move({ active, over }: DragEndEvent) {
    if (!stories || !over || active.id === over.id || busy || searching) return;
    const from = ids.indexOf(Number(active.id));
    const to = ids.indexOf(Number(over.id));
    if (from >= 0 && to >= 0) setStories(arrayMove(stories, from, to));
  }

  async function saveOrder() {
    if (!orderChanged || busy) return;
    setSavingOrder(true);
    setError("");
    try {
      await IslamicStoriesApi.reorder(ids, expectedIds);
      setExpectedIds(ids);
      successToaster("Story order saved.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save the story order.",
      );
    } finally {
      setSavingOrder(false);
    }
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
          if (!editor.story && searching) {
            setSearchInput("");
            changeSearch("");
          } else {
            if (!editor.story) setPage(Math.ceil((ids.length + 1) / pageSize));
            reload();
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-50 py-2">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Islamic Stories
        </h1>
        <div className="flex flex-wrap gap-2">
          {orderChanged && (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={reload}
              >
                Discard changes
              </Button>
              <Button
                type="button"
                isLoading={savingOrder}
                onClick={() => void saveOrder()}
              >
                Save order
              </Button>
            </>
          )}
          <Button
            type="button"
            leftIcon={<Plus size={18} />}
            disabled={actionsDisabled}
            onClick={() => setEditor({ story: null })}
          >
            Add story
          </Button>
        </div>
      </div>
      <form
        role="search"
        className="flex flex-wrap items-center gap-2"
        onSubmit={submitSearch}
      >
        <label className="relative block w-full max-w-lg">
          <span className="sr-only">Search Islamic stories</span>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={17}
            aria-hidden
          />
          <input
            type="search"
            dir="auto"
            placeholder="Search Arabic or English story text"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchInput}
            onChange={(event) => {
              const next = event.target.value;
              setSearchInput(next);
              if (!next) changeSearch("");
            }}
            disabled={actionsDisabled}
            maxLength={200}
          />
        </label>
        <Button type="submit" variant="secondary" disabled={actionsDisabled}>
          Search
        </Button>
        {searching && (
          <Button
            type="button"
            variant="ghost"
            disabled={actionsDisabled}
            onClick={() => {
              setSearchInput("");
              changeSearch("");
            }}
          >
            Clear search
          </Button>
        )}
      </form>
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
        ) : !stories ? (
          <p
            role="status"
            className="px-6 py-8 text-center text-sm text-gray-500"
          >
            Loading stories…
          </p>
        ) : stories.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            {searching ? "No stories match your search." : "No stories yet."}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
              <p className="text-sm text-gray-600">
                {searching
                  ? "Clear search to reorder stories."
                  : "Drag a row by its handle to change the mobile story order."}
              </p>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showAll}
                  disabled={busy}
                  onChange={(event) => setShowAll(event.target.checked)}
                  className="accent-primary"
                />
                Show all stories
              </label>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={move}
            >
              <SortableContext
                items={visible.map(({ story_id }) => story_id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <tr>
                        <th scope="col" className="px-5 py-3">
                          Order
                        </th>
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
                      {visible.map((story, index) => (
                        <SortableStoryRow
                          key={story.story_id}
                          story={story}
                          position={
                            searching
                              ? (story.position ?? story.story_id)
                              : offset + index + 1
                          }
                          dragDisabled={busy || searching}
                          actionsDisabled={actionsDisabled}
                          onEdit={edit}
                          onRemove={remove}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </DndContext>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-600">
                {!showAll && `Page ${page} of ${totalPages} · `}
                {ids.length} stories
              </p>
              {!showAll && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page === 1 || busy}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages || busy}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

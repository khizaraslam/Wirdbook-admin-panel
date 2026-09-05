import React, { useCallback, useEffect, useState } from "react";
import { Library, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useBooks from "./useHooks";
import BooksTable from "./components/BooksTable";
import BookFormModal from "./components/BookFormModal";
import type { BookDTO } from "@/utils/helpers/models/books/book.dto";

const Books = () => {
  const { getAll, create, update } = useBooks();
  const { isLoading } = useStore();
  const [items, setItems] = useState<BookDTO[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<BookDTO | null>(null);

  const loadItems = useCallback(async () => {
    const data = await getAll();
    setItems(
      [...data].sort((a, b) => a.filename.localeCompare(b.filename)),
    );
  }, [getAll]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreate = async (file: File, filename?: string) => {
    const ok = await create(file, filename);
    if (ok) await loadItems();
    return ok;
  };

  const handleUpdate = async (file: File) => {
    if (!updatingItem) return false;
    const ok = await update(updatingItem.filename, file);
    if (ok) {
      setUpdatingItem(null);
      await loadItems();
    }
    return ok;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Library size={28} className="text-primary" />
            Books
          </h1>
          <p className="text-gray-500 mt-1">
            Upload and replace book JSON files. There is no delete action.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add book
        </Button>
      </div>

      {!isLoading && items.length === 0 ? (
        <CustomMessageDisplay
          show
          title="No books found"
          slogan="Upload a JSON book file to get started."
        />
      ) : (
        <BooksTable items={items} onUpdate={setUpdatingItem} />
      )}

      <BookFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <BookFormModal
        isOpen={!!updatingItem}
        onClose={() => setUpdatingItem(null)}
        onSubmit={handleUpdate}
        initial={updatingItem}
      />
    </div>
  );
};

export default Books;

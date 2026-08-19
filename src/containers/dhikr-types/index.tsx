import React, { useCallback, useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";
import useDhikrTypes from "./useHooks";
import DhikrTypesTable from "./components/DhikrTypesTable";
import DhikrTypeFormModal, {
  type FormValues,
} from "./components/DhikrTypeFormModal";
import type { DhikrTypeDTO } from "@/utils/helpers/models/communities/dhikr-type.dto";

const DhikrTypes = () => {
  const { getAll, create, update } = useDhikrTypes();
  const { isLoading } = useStore();
  const [items, setItems] = useState<DhikrTypeDTO[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DhikrTypeDTO | null>(null);

  const loadItems = useCallback(async () => {
    const data = await getAll();
    setItems(
      [...data].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    );
  }, [getAll]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreate = async (values: FormValues) => {
    const ok = await create({
      name: values.name,
      nameAr: values.nameAr,
      description: values.description || undefined,
      sortOrder: values.sortOrder,
    });
    if (ok) await loadItems();
    return ok;
  };

  const handleUpdate = async (values: FormValues) => {
    if (!editingItem) return false;
    const ok = await update(editingItem.id, {
      name: values.name,
      nameAr: values.nameAr,
      description: values.description || null,
      sortOrder: values.sortOrder,
      status: values.status,
    });
    if (ok) {
      setEditingItem(null);
      await loadItems();
    }
    return ok;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={28} className="text-primary" />
            Dhikr types
          </h1>
          <p className="text-gray-500 mt-1">
            Predefined dhikr list for community assignments
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add dhikr type
        </Button>
      </div>

      {!isLoading && items.length === 0 ? (
        <CustomMessageDisplay
          show
          title="No dhikr types found"
          slogan="Create your first dhikr type to get started."
        />
      ) : (
        <DhikrTypesTable items={items} onEdit={setEditingItem} />
      )}

      <DhikrTypeFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        title="Create dhikr type"
        submitLabel="Create"
      />

      <DhikrTypeFormModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleUpdate}
        initial={editingItem}
        title="Edit dhikr type"
        submitLabel="Save"
      />
    </div>
  );
};

export default DhikrTypes;

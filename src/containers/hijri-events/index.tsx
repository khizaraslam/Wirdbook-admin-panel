import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import SortableHijriEventItem from "./components/SortableHijriEventItem";
import AddHijriEventModal from "./components/AddHijriEventModal";
import EditHijriEventModal from "./components/EditHijriEventModal";
import useHijriEvents from "./useHooks";
import type {
  HijriEventDTO,
} from "@/utils/helpers/models/hijri-events/hijri-event.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";

const HijriEvents = () => {
  const {
    getAllEvents,
    addEvent,
    updateEvent,
    reorderEvents,
    deleteEvent,
  } = useHijriEvents();
  const { isLoading } = useStore();
  const [data, setData] = useState<HijriEventDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HijriEventDTO | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    getAllEvents(setData);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(data, oldIndex, newIndex);
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          indexOrder: index,
        }));

        setData(updatedItems);

        const eventIds = updatedItems.map((item) => item.id);
        await reorderEvents(eventIds);
      }
    }
  };

  const handleAdd = async (body: FormData) => {
    await addEvent(body);
    getAllEvents(setData);
  };

  const handleUpdate = async (id: string, body: FormData) => {
    await updateEvent(id, body);
    getAllEvents(setData);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmationPopup(
      "Are you sure you want to delete this Hijri event?",
    );

    if (result.isConfirmed) {
      await deleteEvent(id, setData, data);
    }
  };

  const maxOrder =
    data.length > 0 ? Math.max(...data.map((e) => e.indexOrder)) + 1 : 0;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Hijri Calendar</h1>
          <p className="text-muted mt-2">
            Manage Hijri calendar events for the mobile app
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={20} />}
          className="rounded-md px-5 py-2.5 btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Event
        </Button>
      </div>

      <div className="bg-primary-light rounded-2xl p-8 mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
        <p className="text-muted mb-6">Current Hijri events configuration</p>
        <div className="flex items-center gap-2 text-gray-700 font-medium bg-white/50 w-fit px-4 py-2 rounded-lg border border-primary/10">
          <Calendar size={18} className="text-primary" />
          <span>{data.length} total events • Drag to reorder</span>
        </div>
      </div>

      <div className="mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
        <p className="text-muted">Drag and drop to change order</p>
      </div>

      {data.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.map((item) => (
                <SortableHijriEventItem
                  key={item.id}
                  event={item}
                  onEdit={setEditingEvent}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Hijri Events"
          slogan="Create your first event to get started"
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center"
        />
      )}

      <AddHijriEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
        defaultIndexOrder={maxOrder}
      />
      <EditHijriEventModal
        isOpen={!!editingEvent}
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default HijriEvents;

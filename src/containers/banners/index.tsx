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
import { Plus, ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import SortableBannerItem from "./components/SortableBannerItem";
import AddBannerModal from "./components/AddBannerModal";
import EditBannerModal from "./components/EditBannerModal";
import useBanners from "./useHooks";
import { BannerDTO } from "@/utils/helpers/models/banners/banner.dto";
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import CustomMessageDisplay from "@/components/data-not-found";
import useStore from "@/hooks/useStore";

const Banners = () => {
  const { getAllBanners, createBanner, updateBanner, reorderBanners, deleteBanner } =
    useBanners();
  const { isLoading } = useStore();
  const [data, setData] = useState<BannerDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerDTO | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    getAllBanners(setData);
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

        const bannerIds = updatedItems.map((item) => item.id);
        await reorderBanners(bannerIds);
      }
    }
  };

  const handleAddBanner = async (formData: FormData) => {
    await createBanner(formData);
    getAllBanners(setData);
  };

  const handleUpdateBanner = async (
    id: string,
    formData: FormData,
    method: "put" | "patch" = "put",
  ) => {
    await updateBanner(id, formData, method);
    getAllBanners(setData);
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const formData = new FormData();
    formData.append("isEnabled", enabled ? "true" : "false");
    await updateBanner(id, formData, "patch");
    getAllBanners(setData);
  };

  const handleDeleteBanner = async (id: string) => {
    const result = await confirmationPopup(
      "Are you sure you want to delete this banner?",
    );

    if (result.isConfirmed) {
      await deleteBanner(id, setData, data);
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Mobile Banners</h1>
          <p className="text-muted mt-2">
            Manage banners displayed on the mobile app
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={20} />}
          className="rounded-md px-5 py-2.5 btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Banner
        </Button>
      </div>

      {/* Overview Section */}
      <div className="bg-primary-light rounded-2xl p-8 mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
        <p className="text-muted mb-6">Current banner configuration</p>
        <div className="flex items-center gap-2 text-gray-700 font-medium bg-white/50 w-fit px-4 py-2 rounded-lg border border-primary/10">
          <ImageIcon size={18} className="text-primary" />
          <span>{data.length} total banners • Drag to reorder</span>
        </div>
      </div>

      {/* Banners List Section */}
      <div className="mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Banners</h2>
        <p className="text-muted">Drag and drop to change order</p>
      </div>

      {data.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.map((banner) => (
                <SortableBannerItem
                  key={banner.id}
                  banner={banner}
                  onEdit={setEditingBanner}
                  onDelete={handleDeleteBanner}
                  onToggleEnabled={handleToggleEnabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <CustomMessageDisplay
          show={!isLoading}
          title="No Banners Found"
          slogan="Create your first banner to get started"
          className="bg-white rounded-2xl h-[130px] shadow-sm border border-gray-100 flex justify-center items-center"
        />
      )}

      <AddBannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBanner}
        defaultOrder={data.length}
      />
      <EditBannerModal
        isOpen={!!editingBanner}
        banner={editingBanner}
        onClose={() => setEditingBanner(null)}
        onSave={handleUpdateBanner}
      />
    </div>
  );
};

export default Banners;

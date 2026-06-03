import {
  errorToaster,
  successToaster,
} from "@/utils/helpers/common/alert-service";
import { MobileBanners_APIS } from "@/libs/apis/mobile-banners.api";
import {
  BannerDTO,
  normalizeBanner,
} from "@/utils/helpers/models/banners/banner.dto";

const useBanners = () => {
  const getAllBanners = async (setData: (data: BannerDTO[]) => void) => {
    const response = await MobileBanners_APIS.getAllBanners();
    const { success = false, data = null } = response || {};
    if (success) {
      const list = (data || []) as Parameters<typeof normalizeBanner>[0][];
      setData(list.map((b) => normalizeBanner(b)));
    }
  };

  const createBanner = async (body: FormData) => {
    const response = await MobileBanners_APIS.createBanner(body);
    const { success = false } = response || {};
    if (success) {
      successToaster("Banner created successfully");
    }
  };

  const updateBanner = async (
    id: string,
    body: FormData,
    method: "put" | "patch" = "put",
  ) => {
    const response =
      method === "patch"
        ? await MobileBanners_APIS.partialUpdateBanner(id, body)
        : await MobileBanners_APIS.updateBanner(id, body);
    const { success = false } = response || {};
    if (success) {
      successToaster("Banner updated successfully");
    } else {
      errorToaster("Failed to update banner");
    }
  };

  const reorderBanners = async (bannerIds: string[]) => {
    const response = await MobileBanners_APIS.reorderBanners({ bannerIds });
    const { success = false, message = "" } = response || {};
    if (success) {
      successToaster(message || "Banners reordered successfully");
    } else {
      errorToaster(message || "Failed to reorder banners");
    }
  };

  const deleteBanner = async (
    id: string,
    setData: (data: BannerDTO[]) => void,
    currentData: BannerDTO[],
  ) => {
    const response = await MobileBanners_APIS.deleteBanner(id);
    const { success = false } = response || {};
    if (success) {
      successToaster("Banner deleted successfully");
      const updatedBanners = currentData.filter(
        (banner) => String(banner.id) !== String(id),
      );
      setData(updatedBanners);
    }
  };

  return {
    getAllBanners,
    createBanner,
    updateBanner,
    reorderBanners,
    deleteBanner,
  };
};

export default useBanners;

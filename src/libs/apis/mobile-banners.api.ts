import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utils/helpers/common/http-methods";

export const MobileBanners_APIS = {
  getAllBanners: () => getRequest("/api/admin/mobile-banners"),
  getBanner: (id: string) => getRequest(`/api/admin/mobile-banners/${id}`),
  createBanner: (body: FormData) =>
    postRequest("/api/admin/mobile-banners", body),
  updateBanner: (id: string, body: FormData) =>
    putRequest(`/api/admin/mobile-banners/${id}`, body),
  partialUpdateBanner: (id: string, body: FormData) =>
    patchRequest(`/api/admin/mobile-banners/${id}`, body),
  reorderBanners: (body: { bannerIds: string[] }) =>
    patchRequest("/api/admin/mobile-banners/reorder", body),
  deleteBanner: (id: string) =>
    deleteRequest(`/api/admin/mobile-banners/${id}`),
};

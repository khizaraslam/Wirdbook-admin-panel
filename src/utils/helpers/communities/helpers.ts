export const getCommunityImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_BASE_URL_PREFIX || "";
  return `${base}${imageUrl}`;
};

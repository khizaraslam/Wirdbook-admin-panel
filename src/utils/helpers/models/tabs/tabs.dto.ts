import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

export class TabsDTO {
  id: string;
  slug: string;
  label: string;
  order: number;
  type: ContentType;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<TabsDTO>) {
    this.id = data.id || "";
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
    this.type = data.type || "english";
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
  }
}

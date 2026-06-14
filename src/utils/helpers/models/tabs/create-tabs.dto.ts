import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

export class AddTabDTO {
  slug: string;
  label: string;
  order: number;
  type: ContentType;

  constructor(data: Partial<AddTabDTO>) {
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
    this.type = data.type || "english";
  }
}
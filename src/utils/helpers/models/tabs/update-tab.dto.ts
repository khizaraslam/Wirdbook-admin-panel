import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

export class UpdateTabDTO {
  slug: string;
  label: string;
  order: number;
  type?: ContentType;

  constructor(data: Partial<UpdateTabDTO>) {
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
    this.type = data.type;
  }
}
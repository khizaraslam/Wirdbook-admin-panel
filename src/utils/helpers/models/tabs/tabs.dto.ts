export class TabsDTO {
  id: string;
  slug: string;
  label: string;
  order: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<TabsDTO>) {
    this.id = data.id || "";
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
  }
}

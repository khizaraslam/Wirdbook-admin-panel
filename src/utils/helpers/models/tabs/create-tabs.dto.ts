export class AddTabDTO {
  slug: string;
  label: string;
  order: number;

  constructor(data: Partial<AddTabDTO>) {
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
  }
}
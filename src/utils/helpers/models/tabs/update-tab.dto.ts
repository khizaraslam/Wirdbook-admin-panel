export class UpdateTabDTO {
  slug: string;
  label: string;
  order: number;

  constructor(data: Partial<UpdateTabDTO>) {
    this.slug = data.slug || "";
    this.label = data.label || "";
    this.order = data.order || 0;
  }
}
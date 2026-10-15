export class IslamicHighlightTagDTO {
  id: string;
  labelEn: string;
  labelAr: string;
  slug: string;
  indexOrder: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<IslamicHighlightTagDTO> = {}) {
    this.id = data.id ?? "";
    this.labelEn = data.labelEn ?? "";
    this.labelAr = data.labelAr ?? "";
    this.slug = data.slug ?? "";
    this.indexOrder = data.indexOrder ?? 0;
    this.createdAt = data.createdAt ?? "";
    this.updatedAt = data.updatedAt ?? "";
  }
}

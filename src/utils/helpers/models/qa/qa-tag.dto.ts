export class QaTagDTO {
  id: string;
  labelEn: string;
  labelAr: string;
  slug: string;
  indexOrder: number;
  createdAt: string;
  updatedAt: string;

  constructor(
    data: Partial<QaTagDTO> & {
      nameEn?: string;
      nameAr?: string;
    } = {},
  ) {
    this.id = data.id ?? "";
    this.labelEn = data.labelEn ?? data.nameEn ?? "";
    this.labelAr = data.labelAr ?? data.nameAr ?? "";
    this.slug = data.slug ?? "";
    this.indexOrder = data.indexOrder ?? 0;
    this.createdAt = data.createdAt ?? "";
    this.updatedAt = data.updatedAt ?? "";
  }
}

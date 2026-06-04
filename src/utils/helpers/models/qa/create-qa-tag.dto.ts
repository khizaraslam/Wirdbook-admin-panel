export class CreateQaTagDTO {
  labelEn: string;
  labelAr: string;
  slug?: string;
  indexOrder?: number;

  constructor(
    data: Partial<CreateQaTagDTO> & { nameEn?: string; nameAr?: string } = {},
  ) {
    this.labelEn = data.labelEn ?? data.nameEn ?? "";
    this.labelAr = data.labelAr ?? data.nameAr ?? "";
    this.slug = data.slug;
    this.indexOrder = data.indexOrder;
  }
}

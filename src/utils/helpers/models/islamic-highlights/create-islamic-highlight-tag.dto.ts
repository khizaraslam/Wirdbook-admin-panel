export class CreateIslamicHighlightTagDTO {
  labelEn: string;
  labelAr: string;
  slug?: string;
  indexOrder?: number;

  constructor(data: Partial<CreateIslamicHighlightTagDTO> = {}) {
    this.labelEn = data.labelEn ?? "";
    this.labelAr = data.labelAr ?? "";
    this.slug = data.slug;
    this.indexOrder = data.indexOrder;
  }
}

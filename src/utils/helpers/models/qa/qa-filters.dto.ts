export type QaSortOption = "date" | "alpha";

export class QaFiltersDTO {
  page: number = 1;
  limit: number = 10;
  search: string = "";
  tagId: string | null = null;
  sort: QaSortOption = "date";
  from: string = "";
  to: string = "";
  includeUnpublished: boolean = true;

  constructor(data: Partial<QaFiltersDTO> = {}) {
    this.page = data.page ?? 1;
    this.limit = data.limit ?? 10;
    this.search = data.search ?? "";
    this.tagId = data.tagId ?? null;
    this.sort = data.sort ?? "date";
    this.from = data.from ?? "";
    this.to = data.to ?? "";
    this.includeUnpublished = data.includeUnpublished ?? true;
  }
}

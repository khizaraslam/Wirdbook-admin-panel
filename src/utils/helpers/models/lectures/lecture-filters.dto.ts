export class LectureFiltersDTO {
  page: number = 1;
  limit: number = 10;
  tabId: string | null = null;
  search: string = "";

  constructor(data: Partial<LectureFiltersDTO> = {}) {
    this.page = data.page || 1;
    this.limit = data.limit || 10;
    this.tabId = data.tabId || null;
    this.search = data.search || "";
  }
}

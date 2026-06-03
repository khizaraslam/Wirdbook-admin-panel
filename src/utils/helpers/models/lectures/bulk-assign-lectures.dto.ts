export class BulkAssignLecturesDTO {
  lectureIds: string[];
  tabId: string;

  constructor(data: Partial<BulkAssignLecturesDTO>) {
    this.lectureIds = data.lectureIds || [];
    this.tabId = data.tabId || "";
  }
}

export class AssignLectureTabDTO {
  tabId: string;

  constructor(data: Partial<AssignLectureTabDTO>) {
    this.tabId = data.tabId || "";
  }
}

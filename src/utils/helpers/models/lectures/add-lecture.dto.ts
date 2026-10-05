export class AddLectureFormData {
  title: string;
  dateTime: string;
  tabId: string;
  order: number;
  audio?: File;
  pdf?: File;

  constructor(data: Partial<AddLectureFormData>) {
    this.title = data.title || "";
    this.dateTime = data.dateTime || "";
    this.tabId = data.tabId || "";
    this.order = data.order ?? 0;
    this.audio = data.audio;
    this.pdf = data.pdf;
  }
}

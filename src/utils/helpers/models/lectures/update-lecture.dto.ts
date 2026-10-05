export class UpdateLectureDTO {
  title?: string;
  dateTime?: string;
  tabId?: string;
  order?: number;
  audio?: File;
  pdf?: File;

  constructor(data: Partial<UpdateLectureDTO>) {
    this.title = data.title;
    this.dateTime = data.dateTime;
    this.tabId = data.tabId;
    this.order = data.order;
    this.audio = data.audio;
    this.pdf = data.pdf;
  }
}

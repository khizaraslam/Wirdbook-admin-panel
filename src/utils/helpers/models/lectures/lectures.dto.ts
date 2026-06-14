import type { ContentType } from "@/utils/helpers/enums/content-type.enum";

export class LecturesDTO {
  id: string;
  title: string;
  audioId: string;
  pdfId: string | null;
  audioUrl: string;
  pdfUrl: string | null;
  dateTime: string | null;
  tabId: string | null;
  type: ContentType;
  tab: any | null;

  constructor(data: Partial<LecturesDTO>) {
    this.id = data.id || "";
    this.title = data.title || "";
    this.audioId = data.audioId || "";
    this.pdfId = data.pdfId || null;
    this.audioUrl = data.audioUrl || "";
    this.pdfUrl = data.pdfUrl || null;
    this.dateTime = data.dateTime || null;
    this.tabId = data.tabId || null;
    this.type = data.type || "english";
    this.tab = data.tab || null;
  }
}

import { QaTagDTO } from "./qa-tag.dto";

export class QaItemDTO {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  tagId: string | null;
  tag: QaTagDTO | null;
  isPublished: boolean;
  indexOrder: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<QaItemDTO> = {}) {
    this.id = data.id ?? "";
    this.questionEn = data.questionEn ?? "";
    this.questionAr = data.questionAr ?? "";
    this.answerEn = data.answerEn ?? "";
    this.answerAr = data.answerAr ?? "";
    this.tagId = data.tagId ?? null;
    this.tag = data.tag ? new QaTagDTO(data.tag) : null;
    this.isPublished = data.isPublished ?? false;
    this.indexOrder = data.indexOrder ?? 0;
    this.createdAt = data.createdAt ?? "";
    this.updatedAt = data.updatedAt ?? "";
  }
}

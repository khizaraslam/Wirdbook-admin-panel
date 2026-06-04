export class CreateQaItemDTO {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  tagId?: string;
  isPublished?: boolean;
  indexOrder?: number;

  constructor(data: Partial<CreateQaItemDTO> = {}) {
    this.questionEn = data.questionEn ?? "";
    this.questionAr = data.questionAr ?? "";
    this.answerEn = data.answerEn ?? "";
    this.answerAr = data.answerAr ?? "";
    this.tagId = data.tagId;
    this.isPublished = data.isPublished ?? false;
    this.indexOrder = data.indexOrder;
  }
}

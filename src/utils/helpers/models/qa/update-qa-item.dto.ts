export class UpdateQaItemDTO {
  questionEn?: string;
  questionAr?: string;
  answerEn?: string;
  answerAr?: string;
  tagId?: string | null;
  isPublished?: boolean;
  indexOrder?: number;

  constructor(data: Partial<UpdateQaItemDTO> = {}) {
    Object.assign(this, data);
  }
}

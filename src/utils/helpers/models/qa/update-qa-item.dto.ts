import type { QaVisibility } from "./qa.enums";

export class UpdateQaItemDTO {
  questionEn?: string | null;
  questionAr?: string | null;
  answerEn?: string | null;
  answerAr?: string | null;
  visibility?: QaVisibility;
  tagId?: string | null;
  indexOrder?: number;

  constructor(data: Partial<UpdateQaItemDTO> = {}) {
    Object.assign(this, data);
  }
}

import { QaTagDTO } from "./qa-tag.dto";
import type { QaSource, QaStatus, QaVisibility } from "./qa.enums";

export interface QaAskedByUserDTO {
  id: string;
  name: string;
}

export class QaItemDTO {
  id: string;
  questionEn: string | null;
  questionAr: string | null;
  answerEn: string | null;
  answerAr: string | null;
  tagId: string | null;
  tag: QaTagDTO | null;
  visibility: QaVisibility;
  askedByUserId: string | null;
  askedByUser: QaAskedByUserDTO | null;
  status: QaStatus;
  source: QaSource;
  isPublished: boolean;
  publishedAt: string | null;
  indexOrder: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<QaItemDTO> = {}) {
    this.id = data.id ?? "";
    this.questionEn = data.questionEn ?? null;
    this.questionAr = data.questionAr ?? null;
    this.answerEn = data.answerEn ?? null;
    this.answerAr = data.answerAr ?? null;
    this.tagId = data.tagId ?? null;
    this.tag = data.tag ? new QaTagDTO(data.tag) : null;
    this.visibility = data.visibility ?? "public";
    this.askedByUserId = data.askedByUserId ?? null;
    this.askedByUser = data.askedByUser ?? null;
    this.status = data.status ?? (data.isPublished ? "published" : "draft");
    this.source = data.source ?? "admin";
    this.isPublished = data.isPublished ?? this.status === "published";
    this.publishedAt = data.publishedAt ?? null;
    this.indexOrder = data.indexOrder ?? 0;
    this.createdAt = data.createdAt ?? "";
    this.updatedAt = data.updatedAt ?? "";
  }
}

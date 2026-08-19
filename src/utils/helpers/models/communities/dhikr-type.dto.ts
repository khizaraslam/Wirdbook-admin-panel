import type { DhikrTypeStatus } from "./community.enums";

export interface DhikrTypeDTO {
  id: string;
  name: string;
  nameAr: string;
  description: string | null;
  status: DhikrTypeStatus;
  sortOrder: number;
  createdAt: string;
}

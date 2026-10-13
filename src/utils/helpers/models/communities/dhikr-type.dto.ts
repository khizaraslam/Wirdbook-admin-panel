import type { DhikrTypeStatus } from "./community.enums";

export interface DhikrTypeDTO {
  id: string;
  name: string;
  nameAr: string;
  description: string | null;
  status: DhikrTypeStatus;
  kind?: "standard" | "khitma";
  unit?: "count" | "juz";
  juzTotal?: number | null;
  sortOrder: number;
  createdAt: string;
}

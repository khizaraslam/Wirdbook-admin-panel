export interface HijriEventDTO {
  id: string;
  name: string;
  hijriMonth: number;
  hijriDay: number;
  isHighlighted: boolean;
  arabicName: string;
  icon: string | null;
  indexOrder: number;
}

export interface CreateHijriEventBody {
  name: string;
  hijriMonth: number;
  hijriDay: number;
  isHighlighted?: boolean;
  arabicName: string;
  indexOrder?: number;
  icon?: File | string | null;
}

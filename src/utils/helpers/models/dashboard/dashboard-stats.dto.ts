export class DashboardStatsDTO {
  totalTabs: number;
  totalLectures: number;

  constructor(data: any = {}) {
    this.totalTabs = data.totalTabs || 0;
    this.totalLectures = data.totalLectures || 0;
  }
}

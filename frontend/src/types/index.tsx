
export type RiskStatus = 'On Track' | 'Behind' | 'At Risk' | 'Critical';

export type DashboardSummary = {
  totalSchools: number;
  participationRate: number;
  evidenceRate: number;
  overallAttendanceRate: number;
  overallRiskStatus: RiskStatus;
};

export type DistrictPerformance = {
  district: string;
  totalSchools: number;
  participationRate: number;
  attendanceRate: number;
  riskStatus: RiskStatus;
};

export type GrantMetric = {
  _id: string;
  donor: string;
  grantName: string;
};
// File: backend/services/riskEngine.js

/**
 * Calculates risk status based on a given performance rate (0.0 to 1.0)
 * Thresholds defined by the assignment rules.
 */
const calculateRiskStatus = (rate) => {
  if (typeof rate !== 'number') return 'Unknown';

  if (rate >= 0.75) {
    return 'On Track'; // >= 75%
  } else if (rate >= 0.60) {
    return 'Behind';   // 60% - 74.9%
  } else if (rate >= 0.35) {
    return 'At Risk';  // 35% - 59.9%
  } else {
    return 'Critical'; // < 35%
  }
};

/**
 * Aggregates an array of school responses to determine an overall district or block risk.
 */
const aggregateGroupRisk = (schools) => {
  if (!schools || schools.length === 0) return 'Unknown';

  const totalEnrollment = schools.reduce((sum, school) => sum + school.total_enrollment, 0);
  const totalAttendance = schools.reduce((sum, school) => sum + school.total_attendance, 0);
  
  if (totalEnrollment === 0) return 'Critical';

  const overallAttendanceRate = totalAttendance / totalEnrollment;
  return calculateRiskStatus(overallAttendanceRate);
};

module.exports = {
  calculateRiskStatus,
  aggregateGroupRisk
};
// File: backend/controllers/dashboardController.js
const SchoolResponse = require('../models/SchoolResponse');
const { calculateRiskStatus } = require('../services/riskEngine');

const getDashboardSummary = async (req, res, next) => {
  try {
    const { month, district } = req.query;
    
    // Build dynamic query based on filters
    const query = {};
    if (month) query.reporting_month = month;
    if (district) query.district = district;

    const schools = await SchoolResponse.find(query);

    if (!schools.length) {
      return res.status(200).json({ success: true, data: null, message: "No data found for the selected filters." });
    }

    // 100% Deterministic Calculations
    const totalSchools = schools.length;
    let schoolsConductedPBL = 0;
    let schoolsSubmittedEvidence = 0;
    let totalEnrollment = 0;
    let totalAttendance = 0;

    // schools.forEach(school => {
    //   if (school.pbl_conducted === 'Yes') schoolsConductedPBL++;
    //   if (school.evidence_submitted === 'Yes') schoolsSubmittedEvidence++;
    //   totalEnrollment += school.total_enrollment;
    //   totalAttendance += school.total_attendance;
    // });


  schools.forEach(school => {
  if (school.pbl_conducted === 'Yes') schoolsConductedPBL++;
  if (school.evidence_submitted === 'Yes') schoolsSubmittedEvidence++;
  
  // strict typecasting ensure strings become actual numbers
  const enrollment = Number(school.total_enrollment) || 0;
  const attendance = Number(school.total_attendance) || 0;

  // data guradrails Ab numbers par check bilkul sahi chalega
  const sanitizedAttendance = attendance > enrollment ? enrollment : attendance;

  totalEnrollment += enrollment;
  totalAttendance += sanitizedAttendance;
});
    const participationRate = totalSchools > 0 ? (schoolsConductedPBL / totalSchools) : 0;
    const evidenceRate = totalSchools > 0 ? (schoolsSubmittedEvidence / totalSchools) : 0;
    const overallAttendanceRate = totalEnrollment > 0 ? (totalAttendance / totalEnrollment) : 0;

    // apply deterministic risk engine
    const overallRiskStatus = calculateRiskStatus(overallAttendanceRate);

    res.status(200).json({
      success: true,
      data: {
        totalSchools,
        participationRate,
        evidenceRate,
        overallAttendanceRate,
        overallRiskStatus
      }
    });
  } catch (error) {
    next(error); // passes to globalerrorhandler
  }
};

module.exports = { getDashboardSummary };
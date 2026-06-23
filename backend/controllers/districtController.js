
const SchoolResponse = require('../models/SchoolResponse');
const { calculateRiskStatus } = require('../services/riskEngine');

const getDistrictPerformance = async (req, res, next) => {
  try {
    const { month } = req.query;
    const matchStage = month ? { reporting_month: month } : {};

    // use mongodb aggregation for high performance grouping
    const districtData = await SchoolResponse.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$district",
          totalSchools: { $sum: 1 },
          schoolsConductedPBL: { $sum: { $cond: [{ $eq: ["$pbl_conducted", "Yes"] }, 1, 0] } },
          totalEnrollment: { $sum: "$total_enrollment" },
          totalAttendance: { $sum: "$total_attendance" }
        }
      }
    ]);

    // format and calculate deterministic risk for each district
    const formattedData = districtData.map(dist => {
      const participationRate = dist.totalSchools > 0 ? (dist.schoolsConductedPBL / dist.totalSchools) : 0;
      
      //  strict  typecasting and sanitization
      // pehle fields ko float or number mein strictly force karo
      const enrollmentNum = Number(dist.totalEnrollment) || 0;
      let attendanceNum = Number(dist.totalAttendance) || 0;

      // 🛡️ data guradrail for districts 
      // Agar direct total attendance enrollment se zyada ho gayi hai toh use enrollment par lock kar do
      if (attendanceNum > enrollmentNum) {
        attendanceNum = enrollmentNum;
      }

      const attendanceRate = enrollmentNum > 0 ? (attendanceNum / enrollmentNum) : 0;
      
      return {
        district: dist._id,
        totalSchools: dist.totalSchools,
        participationRate,
        attendanceRate,
        riskStatus: calculateRiskStatus(attendanceRate)
      };
    });

    // Sort by attendance rate means  leaderboard style
    formattedData.sort((a, b) => b.attendanceRate - a.attendanceRate);

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDistrictPerformance };
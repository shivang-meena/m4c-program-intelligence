
const GrantPerformance = require('../models/GrantPerformance');
const { generateNarrative } = require('../services/aiService');

const generateReportNarrative = async (req, res, next) => {
  try {
    const { grantId, month, isAiDisabled } = req.body;

    if (!grantId || !month) {
      return res.status(400).json({ success: false, error: "grantId and month are required in the body." });
    }

    // 1 fetch factual data directly from the deterministic db for No hallucination
    const metrics = await GrantPerformance.findOne({ grant_id: grantId, reporting_month: month });
    
    if (!metrics) {
      return res.status(404).json({ success: false, error: "Data not found to generate narrative." });
    }

    // 2 prepare structured fact object for the ai or fallback service
    const factContext = {
      grantName: metrics.grant_name,
      month: metrics.reporting_month,
      pblCompletionRate: metrics.pbl_completion_rate,
      evidenceSubmissionRate: metrics.evidence_submission_rate,
      attendanceRate: metrics.attendance_rate,
      riskStatus: metrics.risk_status,
      milestoneSummary: metrics.milestone_summary
    };

    // 3 trigger service handles the ai vs raw text logic
    const generatedText = await generateNarrative(factContext, isAiDisabled);

    res.status(200).json({
      success: true,
      data: {
        narrative: generatedText,
        source: isAiDisabled ? 'System (Raw Facts)' : 'AI Assistant'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateReportNarrative };
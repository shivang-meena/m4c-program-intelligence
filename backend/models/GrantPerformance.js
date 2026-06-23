
const mongoose = require('mongoose');

const GrantPerformanceSchema = new mongoose.Schema({
  grant_id: { type: String, required: true },
  donor: { type: String, required: true },
  grant_name: { type: String, required: true },
  reporting_month: { type: String, required: true },
  period_end_date: { type: String, required: true },
  report_due_date: { type: String, required: true },
  report_status: { type: String, required: true },
  covered_districts: { type: String, required: true },
  sampled_school_records: { type: Number, required: true },
  schools_completed_pbl: { type: Number, required: true },
  pbl_completion_rate: { type: Number, required: true },
  schools_with_evidence: { type: Number, required: true },
  evidence_submission_rate: { type: Number, required: true },
  total_enrollment: { type: Number, required: true },
  total_attendance: { type: Number, required: true },
  attendance_rate: { type: Number, required: true },
  risk_status: { type: String, enum: ['On Track', 'Behind', 'At Risk', 'Critical'], required: true },
  milestone_summary: { type: String, required: true },
  draft_report_text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GrantPerformance', GrantPerformanceSchema);
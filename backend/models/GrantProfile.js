
const mongoose = require('mongoose');

const GrantProfileSchema = new mongoose.Schema({
  grant_id: { type: String, required: true }, 
  donor: { type: String, required: true },
  grant_name: { type: String, required: true },
  period_start: { type: String, required: true },
  period_end: { type: String, required: true },
  covered_districts: { type: String, required: true },
  reporting_month: { type: String, required: true },
  budget_line: { type: String, required: true },
  approved_budget_units: { type: Number, required: true },
  monthly_utilized_units: { type: Number, required: true },
  cumulative_utilized_units: { type: Number, required: true },
  cumulative_utilization_rate: { type: Number, required: true },
  finance_note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GrantProfile', GrantProfileSchema);
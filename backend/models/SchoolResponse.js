
const mongoose = require('mongoose');

const SchoolResponseSchema = new mongoose.Schema({
  reporting_month: { type: String, required: true }, // that is  2025-07
  school_name: { type: String, required: true },
  school_code: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  pbl_conducted: { type: String, enum: ['Yes', 'No'], required: true }, // corrected
  evidence_submitted: { type: String, enum: ['Yes', 'No'], required: true }, //  corrected
  classes_conducted: { type: String }, // classes 6, 7 and 8 or not conducted
  subject_taught: { type: String },
  total_enrollment: { type: Number, required: true },
  total_attendance: { type: Number, required: true },
  attendance_rate: { type: Number, required: true },
  risk_status: { type: String, enum: ['On Track', 'Behind', 'At Risk', 'Critical'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('SchoolResponse', SchoolResponseSchema);
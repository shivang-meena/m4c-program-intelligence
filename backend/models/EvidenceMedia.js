
const mongoose = require('mongoose');

const EvidenceMediaSchema = new mongoose.Schema({
  record_id: { type: String, required: true, unique: true },
  record_type: { type: String, required: true }, // image or news_clipping
  grant_id: { type: String, required: true },
  donor: { type: String, required: true },
  reporting_month: { type: String, required: true },
  district: { type: String, required: true },
  title: { type: String, required: true },
  summary_or_caption: { type: String, required: true },
  file_name: { type: String, required: true }, // that is  student_project_activity_photo_01.png
  relative_path: { type: String, required: true },
  usage_note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EvidenceMedia', EvidenceMediaSchema);

const GrantProfile = require('../models/GrantProfile');
const GrantPerformance = require('../models/GrantPerformance');
const EvidenceMedia = require('../models/EvidenceMedia');

const getGrantDetails = async (req, res, next) => {
  try {
    const { grantId, month } = req.query;

    if (!grantId || !month) {
      return res.status(400).json({ success: false, error: "grantId and month are required." }); // Caught by validation logic
    }

    // run parallel queries for speed
    const [performance, finances, media] = await Promise.all([
      GrantPerformance.findOne({ grant_id: grantId, reporting_month: month }),
      GrantProfile.find({ grant_id: grantId, reporting_month: month }), // Returns array of budget lines
      EvidenceMedia.find({ grant_id: grantId, reporting_month: month })
    ]);

    if (!performance) {
      return res.status(404).json({ success: false, error: "Grant report not found for this month." });
    }

    res.status(200).json({
      success: true,
      data: {
        performance,
        finances, // budget lines that is  learning kits mentoring visits
        media     // linked synthetic images
      }
    });
  } catch (error) {
    next(error);
  }
};

// wuick helper api to get dropdown list of grants
const getAvailableGrants = async (req, res, next) => {
  try {
    const grants = await GrantPerformance.aggregate([
      { $group: { _id: "$grant_id", donor: { $first: "$donor" }, grantName: { $first: "$grant_name" } } }
    ]);
    res.status(200).json({ success: true, data: grants });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGrantDetails, getAvailableGrants };
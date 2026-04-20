const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Report, ReportVote, ModerationAction } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { logAction } = require("../services/auditService");

exports.createReport = async (req, res, next) => {
  try {
    const { category, description, latitude, longitude, region, reportTime } =
      req.body;

    if (
      !category ||
      !description ||
      latitude == null ||
      longitude == null ||
      !region ||
      !reportTime
    ) {
      return error(res, "Missing required report fields", 400);
    }

    const allowedCategories = [
      "CHECKPOINT_DELAY",
      "ROAD_CLOSURE",
      "ACCIDENT",
      "WEATHER_HAZARD",
      "OTHER",
    ];

    if (!allowedCategories.includes(category)) {
      return error(res, "Invalid category", 400);
    }

    const duplicates = await sequelize.query(
      `SELECT id, category, latitude, longitude, "reportTime"
       FROM "Reports"
       WHERE category = :category
         AND region = :region
         AND "reportTime" >= NOW() - INTERVAL '2 hours'
       LIMIT 5`,
      {
        replacements: { category, region },
        type: QueryTypes.SELECT,
      },
    );

    const duplicateScore = duplicates.length > 0 ? 0.75 : 0.1;
    const moderationStatus =
      duplicateScore > 0.5 ? "DUPLICATE_REVIEW" : "PENDING";

    const report = await Report.create({
      userId: req.user?.id || null,
      category,
      description,
      latitude,
      longitude,
      region,
      reportTime,
      duplicateScore,
      moderationStatus,
    });

    return success(
      res,
      { report, possibleDuplicates: duplicates },
      "Report submitted",
      201,
    );
  } catch (err) {
    next(err);
  }
};

exports.listReports = async (req, res) => {
  const reports = await Report.findAll({ order: [['createdAt', 'DESC']] });
  return success(res, reports);
};

exports.voteReport = async (req, res) => {
  const { voteType } = req.body;
  const report = await Report.findByPk(req.params.id);
  if (!report) return error(res, 'Report not found', 404);

  await ReportVote.create({ reportId: report.id, userId: req.user.id, voteType });

  const scoreDelta = voteType === 'UP' ? 0.1 : -0.1;
  report.confidenceScore = Math.max(0, Math.min(1, report.confidenceScore + scoreDelta));
  await report.save();

  return success(res, report, 'Vote recorded');
};

exports.moderateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason, duplicateOfIncidentId } = req.body;

    const report = await Report.findByPk(id);

    if (!report) {
      return error(res, "Report not found", 404);
    }

    let moderationStatus;
    let actionType;

    if (action === "APPROVE") {
      moderationStatus = "APPROVED";
      actionType = "REPORT_APPROVED";
    }

    if (action === "REJECT") {
      moderationStatus = "REJECTED";
      actionType = "REPORT_REJECTED";
    }

    if (action === "MARK_DUPLICATE") {
      moderationStatus = "DUPLICATE_REVIEW";
      actionType = "REPORT_MARKED_DUPLICATE";
    }

    report.moderationStatus = moderationStatus;

    if (action === "MARK_DUPLICATE" && duplicateOfIncidentId) {
      report.duplicateScore = 1.0;
    }

    await report.save();

    await logAction({
      targetType: "REPORT",
      targetId: report.id,
      actionType,
      performedBy: req.user.id,
      reason: reason || null,
      metadataJson: {
        action,
        previousModerationStatus: report.previous("moderationStatus"),
        newModerationStatus: moderationStatus,
        duplicateOfIncidentId: duplicateOfIncidentId || null,
      },
    });

    return success(
      res,
      {
        report,
      },
      "Report moderated successfully",
    );
  } catch (err) {
    next(err);
  }
};

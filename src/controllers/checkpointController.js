const { Checkpoint, CheckpointStatusHistory } = require('../models');
const { success, error } = require('../utils/apiResponse');

exports.createCheckpoint = async (req, res) => {
  const checkpoint = await Checkpoint.create(req.body);
  return success(res, checkpoint, 'Checkpoint created', 201);
};

exports.listCheckpoints = async (req, res) => {
  const { region, status, page = 1, size = 10 } = req.query;
  const where = {};
  if (region) where.region = region;
  if (status) where.statusCurrent = status;

  const result = await Checkpoint.findAndCountAll({
    where,
    limit: Number(size),
    offset: (Number(page) - 1) * Number(size),
    order: [['createdAt', 'DESC']]
  });

  return success(res, {
    items: result.rows,
    total: result.count,
    page: Number(page),
    size: Number(size)
  });
};

exports.updateCheckpointStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus, note } = req.body;

  const checkpoint = await Checkpoint.findByPk(id);
  if (!checkpoint) return error(res, 'Checkpoint not found', 404);

  const oldStatus = checkpoint.statusCurrent;
  checkpoint.statusCurrent = newStatus;
  await checkpoint.save();

  await CheckpointStatusHistory.create({
    checkpointId: id,
    oldStatus,
    newStatus,
    changedBy: req.user.id,
    note
  });

  return success(res, checkpoint, 'Checkpoint status updated');
};

const { ModerationAction, User } = require("../models");
const { success } = require("../utils/apiResponse");

exports.listModerationActions = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const size = Math.min(Math.max(Number(req.query.size) || 10, 1), 100);
    const offset = (page - 1) * size;

    const { rows, count } = await ModerationAction.findAndCountAll({
      limit: size,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "performer",
          attributes: ["id", "fullName", "email", "role"],
        },
      ],
    });

    return success(
      res,
      {
        items: rows,
        total: count,
        page,
        size,
      },
      "Success",
    );
  } catch (err) {
    next(err);
  }
};

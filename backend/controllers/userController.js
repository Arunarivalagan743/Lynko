const { User } = require("../model/User");
const { AppError } = require("../utils/AppError");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile };

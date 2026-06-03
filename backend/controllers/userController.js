const { User } = require("../model/User");
const { Url } = require("../model/Url");
const { Visit } = require("../model/Visit");
const { RefreshToken } = require("../model/RefreshToken");
const { PasswordResetToken } = require("../model/PasswordResetToken");
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

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    const userRecord = await User.findById(userId).lean();

    if (!userRecord) {
      throw new AppError("User not found", 404);
    }

    const update = {};

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== userRecord.email) {
        const existing = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: userId },
        }).lean();

        if (existing) {
          throw new AppError("Email already in use", 409);
        }
      }
      update.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).lean();

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const urls = await Url.find({ ownerId: userId }).select("_id").lean();
    const urlIds = urls.map((item) => item._id);

    if (urlIds.length > 0) {
      await Visit.deleteMany({ urlId: { $in: urlIds } });
    }

    await Url.deleteMany({ ownerId: userId });
    await RefreshToken.deleteMany({ userId });
    await PasswordResetToken.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    return res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };

const { getPublicStats } = require("../services/statsService");

const getStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const stats = await getPublicStats(shortCode);

    return res.status(200).json({ stats });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getStats };

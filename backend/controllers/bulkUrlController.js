const { createBulkUrls } = require("../services/bulkUrlService");

const createBulk = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { rows, fileSizeBytes } = req.body;

    const payload = await createBulkUrls({
      ownerId,
      rows,
      fileSizeBytes,
      baseUrl: `${req.protocol}://${req.get("host")}`,
    });

    return res.status(200).json(payload);
  } catch (err) {
    return next(err);
  }
};

module.exports = { createBulk };

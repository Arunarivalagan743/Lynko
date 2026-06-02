const {
  createShortUrl,
  getUserUrls,
  getUrlById,
  deleteUrlById,
  updateUrlById,
} = require("../services/urlService");

const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const ownerId = req.user?.id;

    const { url, qrCodeDataUrl } = await createShortUrl({
      ownerId,
      originalUrl,
      customAlias,
      expiresAt,
      baseUrl: `${req.protocol}://${req.get("host")}`,
    });

    return res.status(201).json({ url, qrCodeDataUrl });
  } catch (err) {
    return next(err);
  }
};

const listUrls = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const urls = await getUserUrls(ownerId);

    return res.status(200).json({ urls });
  } catch (err) {
    return next(err);
  }
};

const getUrl = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;

    const url = await getUrlById(ownerId, id);

    return res.status(200).json({ url });
  } catch (err) {
    return next(err);
  }
};

const deleteUrl = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;

    const url = await deleteUrlById(ownerId, id);

    return res.status(200).json({
      message: "URL deleted",
      url,
    });
  } catch (err) {
    return next(err);
  }
};

const updateUrl = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { originalUrl, expiresAt } = req.body;

    const url = await updateUrlById(ownerId, id, {
      ...(originalUrl ? { originalUrl } : {}),
      ...(expiresAt ? { expiresAt } : {}),
    });

    return res.status(200).json({ url });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUrl,
  listUrls,
  getUrl,
  deleteUrl,
  updateUrl,
};

const { handleRedirect } = require("../services/redirectService");

const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const destination = await handleRedirect(shortCode, req);

    return res.redirect(302, destination);
  } catch (err) {
    return next(err);
  }
};

module.exports = { redirect };

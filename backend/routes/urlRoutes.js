const express = require("express");
const {
  createUrl,
  listUrls,
  getUrl,
  deleteUrl,
} = require("../controllers/urlController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  createUrlSchema,
  urlIdParamSchema,
} = require("../validators/urlValidators");

const router = express.Router();

router.post("/", authenticate, validate(createUrlSchema), createUrl);
router.get("/", authenticate, listUrls);
router.get("/:id", authenticate, validate(urlIdParamSchema, "params"), getUrl);
router.delete(
  "/:id",
  authenticate,
  validate(urlIdParamSchema, "params"),
  deleteUrl
);

module.exports = { urlRoutes: router };

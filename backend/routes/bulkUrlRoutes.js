const express = require("express");
const { createBulk } = require("../controllers/bulkUrlController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { bulkUrlSchema } = require("../validators/bulkUrlValidators");

const router = express.Router();

router.post("/bulk", authenticate, validate(bulkUrlSchema), createBulk);

module.exports = { bulkUrlRoutes: router };

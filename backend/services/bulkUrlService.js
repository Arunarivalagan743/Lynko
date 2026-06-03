const { AppError } = require("../utils/AppError");
const { createShortUrl } = require("./urlService");

const MAX_ROWS = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const createBulkUrls = async ({ ownerId, rows, fileSizeBytes, baseUrl }) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!Array.isArray(rows)) {
    throw new AppError("Rows are required", 400);
  }

  if (fileSizeBytes > MAX_FILE_SIZE) {
    throw new AppError("CSV exceeds 5MB", 400);
  }

  if (rows.length > MAX_ROWS) {
    throw new AppError("CSV exceeds 500 rows", 400);
  }

  const aliasCounts = new Map();
  for (const row of rows) {
    if (row && row.customAlias) {
      aliasCounts.set(row.customAlias, (aliasCounts.get(row.customAlias) || 0) + 1);
    }
  }

  const duplicateAliases = new Set(
    Array.from(aliasCounts.entries())
      .filter((entry) => entry[1] > 1)
      .map((entry) => entry[0])
  );

  const results = [];
  let success = 0;
  let failed = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index] || {};
    const originalUrl = row.originalUrl;
    const customAlias = row.customAlias;

    if (!originalUrl) {
      failed += 1;
      results.push({
        index,
        originalUrl,
        customAlias,
        status: "failed",
        error: { message: "Original URL is required" },
      });
      continue;
    }

    if (customAlias && duplicateAliases.has(customAlias)) {
      failed += 1;
      results.push({
        index,
        originalUrl,
        customAlias,
        status: "failed",
        error: { message: "Duplicate alias in upload" },
      });
      continue;
    }

    try {
      const { url, qrCodeDataUrl } = await createShortUrl({
        ownerId,
        originalUrl,
        customAlias,
        baseUrl,
      });

      success += 1;
      results.push({
        index,
        originalUrl,
        customAlias,
        status: "success",
        url,
        qrCodeDataUrl,
      });
    } catch (err) {
      failed += 1;
      results.push({
        index,
        originalUrl,
        customAlias,
        status: "failed",
        error: {
          message: err.message,
          details: err.details || null,
        },
      });
    }

    // Emit progress: every 10 rows, or at the very end of the batch
    const processed = index + 1;
    if (processed % 10 === 0 || processed === rows.length) {
      try {
        const { emitToUser } = require("../utils/socket");
        emitToUser(ownerId, "bulkProgress", {
          type: "bulkProgress",
          processed,
          total: rows.length,
        });
      } catch (err) {
        console.error("Failed to emit bulkProgress socket event:", err);
      }
    }
  }

  return {
    processed: rows.length,
    success,
    failed,
    results,
  };
};

module.exports = {
  createBulkUrls,
};

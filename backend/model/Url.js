const mongoose = require("mongoose");

const SUPPORTED_PLATFORMS = ["instagram", "linkedin", "twitter", "facebook", "whatsapp", "youtube", "telegram"];

const urlSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    platforms: {
      type: [String],
      enum: SUPPORTED_PLATFORMS,
      default: [],
    },
  },
  { timestamps: true }
);

urlSchema.index({ ownerId: 1, createdAt: -1 });
urlSchema.index({ ownerId: 1, clickCount: -1 }); // FEATURE 1: top-links sort
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Url = mongoose.model("Url", urlSchema);

module.exports = { Url };

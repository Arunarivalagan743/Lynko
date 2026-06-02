const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    browser: {
      type: String,
      default: "unknown",
      trim: true,
    },
    device: {
      type: String,
      default: "unknown",
      trim: true,
    },
    operatingSystem: {
      type: String,
      default: "unknown",
      trim: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
      trim: true,
    },
    referrer: {
      type: String,
      default: null,
      trim: true,
    },
    userAgent: {
      type: String,
      default: null,
      trim: true,
    },
    campaign: {
      type: String,
      default: null,
      trim: true,
    },
    isBot: {
      type: Boolean,
      default: false,
    },
    botType: {
      type: String,
      default: null,
      trim: true,
    },
    clickQuality: {
      type: String,
      enum: ["human", "bot", "suspicious"],
      default: "human",
    },
  },
  { timestamps: true }
);

visitSchema.index({ urlId: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, device: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, browser: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, operatingSystem: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, createdAt: -1 });

const Visit = mongoose.model("Visit", visitSchema);

module.exports = { Visit };

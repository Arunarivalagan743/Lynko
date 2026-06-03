const mongoose = require("mongoose");

const SUPPORTED_PLATFORMS = ["instagram", "linkedin", "twitter", "facebook", "whatsapp", "youtube", "telegram"];

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
    city: {
      type: String,
      default: null,
      trim: true,
    },
    region: {
      type: String,
      default: null,
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
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
    platform: {
      type: String,
      enum: [null, ...SUPPORTED_PLATFORMS],
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

visitSchema.index({ urlId: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, device: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, browser: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, operatingSystem: 1, timestamp: -1 });
visitSchema.index({ urlId: 1, createdAt: -1 });
visitSchema.index({ urlId: 1, referrer: 1 });          // FEATURE 2: referrer analytics
visitSchema.index({ urlId: 1, country: 1 });            // FEATURE 3: geography analytics
visitSchema.index({ urlId: 1, clickQuality: 1 });       // FEATURE 5: traffic quality
visitSchema.index({ urlId: 1, platform: 1 });           // Platform Tracking

const Visit = mongoose.model("Visit", visitSchema);

module.exports = { Visit };

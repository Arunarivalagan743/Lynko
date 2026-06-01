const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

urlSchema.index({ ownerId: 1, createdAt: -1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Url = mongoose.model("Url", urlSchema);

module.exports = { Url };

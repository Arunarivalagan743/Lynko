const mongoose = require("mongoose");
const { env } = require("./env");

const connectDb = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri, {
    autoIndex: env.nodeEnv !== "production",
    serverSelectionTimeoutMS: 5000,
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

module.exports = { connectDb };

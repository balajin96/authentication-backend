import mongoose from "mongoose";
import env from "./env.js";
import { logger } from "./logger.js";

const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production",
    });

    logger.info("mongodb_connected", {
      host: mongo.connection.host,
      dbName: mongo.connection.name,
    });
  } catch (error) {
    logger.error("mongodb_connection_failed", { error: error.message });
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
  logger.info("mongodb_disconnected");
};

export default connectDB;

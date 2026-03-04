import app from "./app.js";
import connectDB, { disconnectDB } from "./config/dbConnect.js";
import env from "./config/env.js";
import { logger } from "./config/logger.js";

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(env.PORT, () => {
      logger.info("server_started", { port: env.PORT, nodeEnv: env.NODE_ENV });
    });
  } catch (error) {
    logger.error("startup_failed", { error: error.message });
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  logger.info("shutdown_started", { signal });

  if (!server) {
    await disconnectDB();
    process.exit(0);
  }

  server.close(async () => {
    try {
      await disconnectDB();
      logger.info("shutdown_complete");
      process.exit(0);
    } catch (error) {
      logger.error("shutdown_failed", { error: error.message });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("shutdown_forced_timeout");
    process.exit(1);
  }, 10000).unref();
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    void shutdown(signal);
  });
});

void startServer();

process.on("unhandledRejection", (reason) => {
  logger.error("unhandled_rejection", {
    error: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on("uncaughtException", (error) => {
  logger.error("uncaught_exception", { error: error.message });
  process.exit(1);
});

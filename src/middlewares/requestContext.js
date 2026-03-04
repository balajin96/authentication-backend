import { randomUUID } from "crypto";
import { logger } from "../config/logger.js";

export const attachRequestContext = (req, res, next) => {
  const startedAt = Date.now();
  const incomingRequestId = req.headers["x-request-id"];
  req.requestId =
    typeof incomingRequestId === "string" ? incomingRequestId : randomUUID();
  res.setHeader("x-request-id", req.requestId);

  res.on("finish", () => {
    logger.info("request_completed", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};

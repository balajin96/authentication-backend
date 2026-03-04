import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import env from "./config/env.js";
import { attachRequestContext } from "./middlewares/requestContext.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowAllOrigins = env.CORS_ORIGINS.includes("*");
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowAllOrigins || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(attachRequestContext);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "rolebasedauth-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Backward-compatible aliases for older clients.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

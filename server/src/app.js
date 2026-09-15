import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import router from "./router.js";
import errorHandler from "./error/errorHandler.js";

// starting express application
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    exposedHeaders: ["access-token"],
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use(router);

// error handler
app.use(errorHandler);

export default app;

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { mountedRoutes } from "./Routes.js";
import globalErrorHandler from "../errorHandlers/errorHandler.js";

const app = express();

// Always put at the top of all middlewares
// SET Security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

// The cookie parser; for handling sending cookie to the frontend
app.use(cookieParser());

// The cross origin resource sharing
const corOptions = cors({
  //   origin: process.env.ORIGIN,
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
});
app.use(corOptions);

mountedRoutes(app);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

export default app;

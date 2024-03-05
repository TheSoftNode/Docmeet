import express from "express";
import morgan from "morgan";
import helmet from "helmet";

import { mountedRoutes } from "./Routes.js";
import globalErrorHandler from "../errorHandlers/errorHandler.js";

const app = express();

// Always put at the top of all middlewares
// SET Security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

// The body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

mountedRoutes(app);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

export default app;

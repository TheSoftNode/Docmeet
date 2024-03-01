import express from "express";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

// Always put at the top of all middlewares
// SET Security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

export default app;

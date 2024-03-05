import express from "express";
import authRouter from "../routes/authRoutes.js";
import userRouter from "../routes/userRoutes.js";
import doctorRouter from "../routes/doctorRoutes.js";

export const mountedRoutes = function (app) {
  app.use(express.json());
  app.use("/api/v1/userAuth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/doctors", doctorRouter);
};

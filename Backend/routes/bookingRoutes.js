import express from "express";
import { getCheckoutSession } from "../controllers/bookingController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";

const router = express.Router();

router
  .route("/checkout-session/:doctorId")
  .post(isAuthenticated, getCheckoutSession);

export default router;

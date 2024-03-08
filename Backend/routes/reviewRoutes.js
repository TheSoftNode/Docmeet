import express from "express";
import {
  createReview,
  getAllReviews,
  getReview,
  setDoctorPatientIds,
  updateReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("patient"), setDoctorPatientIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("patient", "admin"), updateReview);
//   .delete(restrictTo("patient", "admin"), deleteReview);

export default router;

import express from "express";

import {
  createDoctor,
  deleteMe,
  deleteDoctor,
  getAllDoctors,
  getMe,
  getDoctor,
  updateMe,
  updateDoctor,
  updateDoctorRole,
} from "../controllers/doctorController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

// Ensure that all the routes below are authenticated
router.use(isAuthenticated);
router.get("/me", getMe, getDoctor);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

router.route("/").get(getAllDoctors);
router.route("/:id").get(getDoctor);

// Restrict the endpoints below to admin access only
router.use(restrictTo("admin"));
router.route("/").post(createDoctor);
router.patch(updateDoctor).delete(deleteDoctor);

router.route("/update-doctor-role/:id").patch(updateDoctorRole);

export default router;

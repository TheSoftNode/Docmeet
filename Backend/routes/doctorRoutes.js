import express from "express";

import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  updateMe,
  updateDoctor,
  updateDoctorRole,
  getDoctorProfile,
  deActivateDoctor,
  approveDoctor,
  //   getAllDoctorsByAdmin,
} from "../controllers/doctorController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

// Ensure that all the routes below are authenticated
router.use(isAuthenticated);
router.get("/profile/me", restrictTo("doctor"), getDoctorProfile, getDoctor);
router.patch("/update-me", updateMe);
router.delete(
  "/profile/delete-me",
  restrictTo("doctor"),
  getDoctorProfile,
  deleteDoctor
);
router.delete(
  "/profile/deactivate-me",
  restrictTo("doctor"),
  getDoctorProfile,
  deActivateDoctor
);

router.route("/").get(getAllDoctors);
router.route("/:id").get(getDoctor);

// Restrict the endpoints below to admin access only
router.use(restrictTo("admin"));
router.route("/").post(createDoctor);
// router.route("/all-doctors/admin").get(getAllDoctorsByAdmin);
router.route("/:id").patch(updateDoctor).delete(deleteDoctor);
router.route("/deactivate/:id").delete(deActivateDoctor);

router.route("/approve/:id").patch(approveDoctor);

router.route("/update-doctor-role/:id").patch(updateDoctorRole);

export default router;

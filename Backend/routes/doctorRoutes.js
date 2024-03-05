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
} from "../controllers/doctorController.js";

const router = express.Router();

// Ensure that all the routes below are authenticated
router.get("/me", getMe, getDoctor);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

// Restrict the endpoints below to admin access only
router.route("/").get(getAllDoctors).post(createDoctor);
router.route("/:id").get(getDoctor).patch(updateDoctor).delete(deleteDoctor);

export default router;

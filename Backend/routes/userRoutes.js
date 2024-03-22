import express from "express";

import {
  createUser,
  deActivateUser,
  deleteUser,
  getAllUsers,
  getMyAppointments,
  getUser,
  getUserProfile,
  updateMe,
  updateUser,
  updateUserRole,
} from "../controllers/userController.js";
import restrictTo from "../middlewares/roleManager.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";

const router = express.Router();

// Ensure that all the routes below are authenticated
router.use(isAuthenticated);
router.get("/profile/me", restrictTo("patient"), getUserProfile, getUser);
router.get(
  "/appointments/my-appointments",
  restrictTo("patient"),
  getMyAppointments
);
router.patch("/update-me", updateMe);
router.delete(
  "/profile/delete-me",
  restrictTo("patient"),
  getUserProfile,
  deleteUser
);
router.delete(
  "/profile/deactivate-me",
  restrictTo("patient"),
  getUserProfile,
  deActivateUser
);

// Restrict the endpoints below to admin access only
router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/deactivate/:id").delete(deActivateUser);

router.route("/update-user-role/:id").patch(updateUserRole);

export default router;

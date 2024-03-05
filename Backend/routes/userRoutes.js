import express from "express";

import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

// Ensure that all the routes below are authenticated
router.get("/me", getMe, getUser);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

// Restrict the endpoints below to admin access only
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/update-user-role/:id").patch(updateUserRole);

export default router;

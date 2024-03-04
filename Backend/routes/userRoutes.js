import express from "express";
import {
  signUp,
  activateUser,
  login,
  refreshToken,
} from "../controllers/authController.js";
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/activateUser").post(activateUser);
router.route("/login").post(login);
router.route("/refresh-token").get(refreshToken);

export default router;

import express from "express";
import { signUp, activateUser, login } from "../controllers/authController.js";
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/activateUser").post(activateUser);
router.route("/login").post(login);

export default router;

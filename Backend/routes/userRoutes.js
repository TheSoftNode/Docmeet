import express from "express";
import { signUp, activateUser } from "../controllers/authController.js";
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/activateUser").post(activateUser);

export default router;

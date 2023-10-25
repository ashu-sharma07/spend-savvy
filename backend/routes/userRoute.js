import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  setPref,
  setMedical,
} from "../controllers/userController.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/").post(resetPassword);
router.route("/pref").post(isAuthenticatedUser, setPref);
router.route("/medical").post(isAuthenticatedUser, setMedical);
export default router;

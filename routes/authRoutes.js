import express from "express";
import {
  handleEmailSignUp,
  handleEmailSignIn,
  isEmailVerified,
  handleResendVerification,
  signInWithGoogle,
} from "../authentication/auth.js";

const router = express.Router();

//Route 1: Handling the signUp using email and password
// router.post("/signup", handleEmailSignUp);
router.route("/signup").post(handleEmailSignUp);

//Route 2: Handling the signIn using email and password
router.post("/signin", handleEmailSignIn);

//Route 3: Handling the email verification
router.post("/isEmailVerified", isEmailVerified);

//Route 4: Resend the email verification
router.post("/resendEmailVerification", handleResendVerification);

//Route 5: Handling signIn ans signUp using Google
router.get("/google/signin", signInWithGoogle);

// module.exports = router;
export { router as authRoutes };

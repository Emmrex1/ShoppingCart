import express from "express";
import passport from "passport";
import {
  handleGoogleAuth,
  handleGithubAuth,
  handleFacebookAuth,
} from "../controller/authController.js";

const authRouter = express.Router();

// -------- Google --------
authRouter.get("/google-auth", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get(
  "/google-auth/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleAuth
);

// -------- GitHub --------
authRouter.get("/github-auth", passport.authenticate("github", { scope: ["user:email"] }));
authRouter.get(
  "/github-auth/callback",
  passport.authenticate("github", { session: false }),
  handleGithubAuth
);

// -------- Facebook --------
authRouter.get("/facebook-auth", passport.authenticate("facebook", { scope: ["email"] }));
authRouter.get(
  "/facebook-auth/callback",
  passport.authenticate("facebook", { session: false }),
  handleFacebookAuth
);

export default authRouter;

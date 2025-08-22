// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";

const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET,
  BACKEND_URL, 
} = process.env;

export default function setupPassport() {
  // Google
  passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/oauth/google-auth/callback`
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));


  // GitHub
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/api/oauth/github-auth/callback`
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  // Facebook
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/api/oauth/facebook-auth/callback`,
    profileFields: ["id", "emails", "name"]
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
}

import jwt from "jsonwebtoken";

const generateToken = (user) => {
  // Normalize user profile
  const payload = {
    id: user.id,
    name: user.displayName || user.username || "",
    email: user.emails?.[0]?.value || "",
    avatar: user.photos?.[0]?.value || null,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

const redirectWithToken = (req, res, provider) => {
  try {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
  } catch (err) {
    console.error(`${provider} Auth Error:`, err.message);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?error=${provider}_failed`);
  }
};


// Google OAuth
const handleGoogleAuth = async (req, res) => {
  try {
    const token = generateToken(req.user);

    // Redirect to Next.js frontend with token in query string
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?error=google_failed`);
  }
};

// GitHub OAuth
const handleGithubAuth = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
  } catch (err) {
    console.error("Github Auth Error:", err.message);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?error=github_failed`);
  }
};

// Facebook OAuth
const handleFacebookAuth = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
  } catch (err) {
    console.error("Facebook Auth Error:", err.message);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?error=facebook_failed`);
  }
};

export { handleGoogleAuth, handleGithubAuth, handleFacebookAuth };

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import setupPassport from "./config/passport.js";
import authRouter from "./routes/authRoutes.js";


const app = express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); 

setupPassport(); 

const allowedOrigins = [
  "https://shoppingcart-taupe-one.vercel.app",
  "https://shoppingcart-taupe-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!isProduction) {
        callback(null, true);
      } else {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`Blocked by CORS: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);

// Connect to DB
connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
});

// Routes
app.use("/api/auth", userRouter); 
app.use("/api/oauth", authRouter); 

// Test route
app.get("/", (req, res) => {
  res.send("API connected Successfully");
});

// Start server
app.listen(port, () => {
  console.log(
    `Server running on PORT ${port} in ${
      isProduction ? "production" : "development"
    } mode`
  );
});

import express from 'express';
import {
  
  handleUserLogin,
  handleUserRegister,
  handleUpdateProfile,
  handleLogout,
  handleChangePassword,
  deactivateAccount,
  getUserNotifications,
  clearAllNotifications,
  markNotificationAsRead,
  forgotPassword,
  resetPassword,
  handleRefreshToken,
  handleEmailVerify,

} from '../controller/userController.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/multer.js';


const userRouter = express.Router();

// Public
userRouter.post('/register', handleUserRegister);
userRouter.post('/login', handleUserLogin);
userRouter.get('/verify-email/:token', handleEmailVerify);
userRouter.post('/refresh-token', handleRefreshToken);
userRouter.post("/logout", handleLogout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// Authenticated User
userRouter.patch("/update-profile", verifyToken, upload.single("image"), handleUpdateProfile);
userRouter.patch("/change-password", verifyToken, handleChangePassword);
userRouter.patch("/deactivate", verifyToken, deactivateAccount);
userRouter.get("/notifications", verifyToken, getUserNotifications);
userRouter.delete("/notifications", verifyToken, clearAllNotifications);
userRouter.patch("/notifications/:index/read", verifyToken, markNotificationAsRead);


export default userRouter;

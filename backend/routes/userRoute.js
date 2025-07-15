import express from "express";
import { loginUser, registerUser, adminLogin, refreshAccessToken, getUserData, addUser, getUserList, removeUser, removeMultipleUsers, getUserDataById, editUser, updateUserDataForSecurityProfile, updateUserDataForProfile, getUserDataForProfile } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import { verifyRefreshToken } from "../middleware/verifyRefreshToken.js"

const userRouter = express.Router();

userRouter.get("/refresh-token", verifyRefreshToken, refreshAccessToken);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/info", userAuth, getUserData);
userRouter.get("/profile", userAuth, getUserDataForProfile);
userRouter.patch("/profile", userAuth, updateUserDataForProfile);
userRouter.patch("/security-profile", userAuth, updateUserDataForSecurityProfile);
userRouter.get("/single/:id", adminAuth, getUserDataById);
userRouter.patch("/update/:id", adminAuth, editUser);
userRouter.get("/list", adminAuth, getUserList);
userRouter.post("/add", adminAuth, addUser);
userRouter.delete("/remove", adminAuth, removeUser);
userRouter.delete("/remove-multiple", adminAuth, removeMultipleUsers);

export default userRouter;
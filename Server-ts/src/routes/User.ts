import { Router } from "express";
import { changedPassword, login, sendOTP, signUp } from "../controllers/Auth";
import { auth } from "../middlewares/auth";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword";

const userRouter = Router();

userRouter.post("/login", login)
userRouter.post("/signup", signUp)
userRouter.post("/sendotp", sendOTP)
userRouter.post("/change-password", auth , changedPassword)
userRouter.post("/reset-password-token",resetPasswordToken)
userRouter.post("/reset-password", resetPassword)


export default userRouter;
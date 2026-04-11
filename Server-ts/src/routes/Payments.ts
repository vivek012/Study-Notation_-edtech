import { Router } from "express";
import { auth, isStudent } from "../middlewares/auth";
import { capturePayment, sendPaymentSuccessEmail, verifySignature } from "../controllers/Payments";
const paymentRouter =Router()

paymentRouter.post("/capturePayment", auth , isStudent , capturePayment)
paymentRouter.post("/verifyPayment",auth, isStudent, verifySignature)
paymentRouter.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

export default paymentRouter;
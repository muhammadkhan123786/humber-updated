import { Router } from "express";
import { GenerateOTP, UpdatePassword, VerifyOTP } from "../../controllers/otp/otp.controller";

const otpRouter = Router();

otpRouter.post('/send-otp', GenerateOTP);
otpRouter.post('/verify-otp', VerifyOTP);
otpRouter.post('/update-passoword', UpdatePassword);


export default otpRouter;
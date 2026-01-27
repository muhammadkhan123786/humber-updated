import { Router } from "express";
import { GenerateOTP } from "../../controllers/otp/otp.controller";

const otpRouter = Router();

otpRouter.post('/send-otp', GenerateOTP);


export default otpRouter;
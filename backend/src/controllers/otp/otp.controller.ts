import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../../models/user.models";
import { DriverModel } from "../../models/driver/driver.models";
import { OTPMODEL } from "../../models/otp-mobile-app/otp.models";
import { GenerateOtp } from "../../utils/generate.otps.utls";
import { sendEmailTemplate } from "../../utils/sendEmailUtil";
import { hashPassword } from "../../services/auth.service";

const templatePath = path.join(process.cwd(), "templates", "otpEmail.html");



export const GenerateOTP = async (req: Request, res: Response) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        if (user.role === "Driver") {
            const driver = await DriverModel.findOne({ accountId: user._id });

            if (!driver) {
                return res.status(404).json({ message: "Driver profile not found" });
            }

            if (!driver.isVerified) {
                return res.status(403).json({
                    message: "Your account is not verified. Cannot reset password."
                });
            }
        }

        // Generate OTP
        const otpCode = GenerateOtp();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Remove old OTP if exists
        await OTPMODEL.deleteMany({ emailId });

        // Save new OTP
        await OTPMODEL.create({
            otpCode,
            emailId,
            optExpiresAt: otpExpiresAt,
            otpAttempts: 0
        });

        // Read & inject OTP in email template
        let html = fs.readFileSync(templatePath, "utf-8");
        html = html.replace("{{OTP_CODE}}", otpCode);

        // Send email
        await sendEmailTemplate(emailId, html, "OTP for Password Reset");

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error("Generate OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const VerifyOTP = async (req: Request, res: Response) => {
    try {
        const { otp, emailId } = req.body;

        if (!emailId || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        if (user.role === "Driver") {
            const driver = await DriverModel.findOne({ accountId: user._id });

            if (!driver) {
                return res.status(404).json({ message: "Driver profile not found" });
            }

            if (!driver.isVerified) {
                return res.status(403).json({
                    message: "Your account is not verified. Cannot reset password."
                });
            }
        }

        const otpRecord = await OTPMODEL.findOne({ emailId });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found. Request a new one."
            });
        }


        if (otpRecord.isVerified) {
            return res.status(400).json({
                message: "OTP already verified. Request a new one."
            });
        }


        if (otpRecord.optExpiresAt < new Date()) {
            await OTPMODEL.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                message: "OTP expired. Request a new one."
            });
        }
        if (otpRecord.otpCode !== otp) {
            if (otpRecord.otpAttempts >= 5) {
                await OTPMODEL.deleteOne({ _id: otpRecord._id });
                return res.status(429).json({
                    message: "Maximum OTP attempts exceeded."
                });
            }

            otpRecord.otpAttempts += 1;
            await otpRecord.save();

            return res.status(400).json({ message: "Invalid OTP" });
        }


        otpRecord.isVerified = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const UpdatePassword = async (req: Request, res: Response) => {
    try {
        const { emailId, password, confirmPassword } = req.body;

        if (!emailId || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Email, password and confirm password are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password must match"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        if (user.role === "Driver") {
            const driver = await DriverModel.findOne({ accountId: user._id });

            if (!driver) {
                return res.status(404).json({ message: "Driver profile not found" });
            }

            if (!driver.isVerified) {
                return res.status(403).json({
                    message: "Your account is not verified. Cannot reset password."
                });
            }
        }

        const otpRecord = await OTPMODEL.findOne({ emailId });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found. Request a new one."
            });
        }

        if (!otpRecord.isVerified) {
            return res.status(400).json({
                message: "OTP not verified. Please verify first."
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password
        await User.findOneAndUpdate(
            { email: emailId },
            { $set: { password: hashedPassword } }
        );

        // Delete OTP after successful reset
        await OTPMODEL.deleteMany({ emailId });

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


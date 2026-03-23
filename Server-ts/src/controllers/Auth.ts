import User from "../models/User"
import OTP from "../models/OTP";
import otpGenerator from "otp-generator"
import bcrypt from "bcrypt"
import crypto from "crypto";
import mailSender from "../utils/mailSender"
import jwt from "jsonwebtoken"
import Profile from "../models/Profile";
import { Request, Response } from "express";

// send OTP
export const sendOTP = async (req: Request, res: Response) => {
    try {
        // fetch email from request body 
        const { email } = req.body;

        // check id user already exist 
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                success: false,
                message: "User Already exist"
            })
        }

        // otp Generate 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        })

        // check unique otp  oor not 
        let result = await OTP.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            });
            result = await OTP.findOne({ otp: otp })
        }

        const otpPayload = { email, otp }

        // create an entry for OTP
        const otpBody = await OTP.create(otpPayload)

        console.log(otpBody);
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

//SignUp

export const signUp = async (req: Request, res: Response) => {
    try {
        // DatA FETCH FROM REQUEST BODY
        const { firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp } = req.body


        //  VALIDATE USER 

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {

            return res.status(403).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        //  MATCH SAME PASSWORD 
        if (password !== confirmPassword) {
            return res.status(400 ).json({
                success: false,
                message: "Password and COnfirm Password should be Same"
            })
        }

        // check user Already Exist or Not 
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exist please try to login "
            })
        }

        //  Find Most Recent otp
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // VALIDATE OTP
        if (recentOtp.length == 0) {
            // OTP NOT FOUND
            return res.status(404).json({
                success: false,
                message: "otp not found "
            })
        } else if (otp != recentOtp[0].otp) {
            return res.status(400).json({  
                success: false,
                message: "Invalid Otp"
            })
        }

        // Hash Password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the User  

        let approved: String | boolean = "";
        approved === "Instuctor" ?  (approved = false) : (approved = true)

        // Entry create in DB 

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })


        //SENDING RESPONSE 

        return res.status(201).json({
            success: true,
            message: "Account Created Successfully"
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Login

export const login = async (req: Request, res: Response) => {
    try {
        // GET DATA FROM REQ BODY
        const { email, password } = req.body
        // VALIDATIN DATA
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        // USER CHECK EXIST OR NOT
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: " User Does Not Exist"
            })
        }

        //GENERATE JWT, AFTER PASSWORD MATCHING 

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET!, {
                expiresIn: "2h",
            })

            user.token = token;
            user.password = undefined as any

            // CREATE COOKIE AND SEND RESPONSE
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httponly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully"
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Password does not match"
            })
        }



    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


// changedpassword 
export const changedPassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = (req as any).user.id;

        // 1️⃣ Validate input
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old and new password cannot be same",
            });
        }

        // 2️ Get user (with password)
        const user = await User.findById(userId).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 3️ Verify old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // 4️ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 5️ Update password
        user.password = hashedPassword;
        await user.save();

        // 6️ Send confirmation email
        await mailSender(
            user.email,
            "Password Updated",
            "Your password has been changed successfully"
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


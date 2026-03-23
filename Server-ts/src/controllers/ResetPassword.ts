import { Request, Response , NextFunction, response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import mailSender from "../utils/mailSender";

//resetPasswordToken

export const resetPasswordToken = async (req: Request, res: Response) => {
    try {
        // get email from request body
        const {email} = req.body;

        // check user exist or not  with the email
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found with this email "
            })
        }

        // generate token for reset password
        const token = crypto.randomUUID();

        // udate user by adding resetPasswordToken
        const UpdatedDetails = await User.findOneAndUpdate(
                                        {email:email},
                                        {token:token,
                                        resetPasswordExpires: Date.now()+ 5*60*1000},
                                        {new:true}
        )                           
        // create url
        const url = `http://localhost:5173/update-password/${token}`; 

        // send email to user with the url 
        await mailSender(email, "Password Reset Link", `click here to reset yout password ${url}`)

        // send response
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Somethiing went wrong while authenticating user",
        })
    }
}


// resetPassword


export const resetPassword = async (req: Request, res: Response) => {
    try {
        //  data fetch 
        const {password, confirmPassword, token} = req.body;
        // validation 
        if(!password || !confirmPassword){
            return res.status(400).json({
                succes:false,
                message: 'Please enter password',
            })
        }


        if(password !== confirmPassword){
            return res.json({
                success:false,
                message: "password and confirm Password should be same"
            })
        }
        // get user details from db using token 

        const userDetails = await User.findOne({token:token})

        // if no entry -  then invalid token 
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message: "Token is invalid"
            })
        }
        // token time check 
        if(userDetails.resetPasswordExpires && userDetails.resetPasswordExpires.getTime() < Date.now()){
            return res.status(400).json({
                success:false,
                message: "Token is expired"
            })
        }
        // hash new pswd 

        const hashedPassword = await bcrypt.hash(password, 10)
        // pswd update in db 
        const updateDetails = await User.findOneAndUpdate(
                                        {token:token},{password:hashedPassword},{new:true})
        // return response
            return res.status(200).json({
                success:true,
                message: "password reset Successfully"
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Somethiing went wrong while authenticating user",
        })
    }
}

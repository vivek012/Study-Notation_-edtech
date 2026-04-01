import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}



//auth
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //  extrct token 
         const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "")
         console.log(req.header("Authorization"))


         if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            })
         }
         console.log(token)
         console.log(process.env.JWT_SECRET)

         try {
             //   verify token
             console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
             const decode =  jwt.decode(token); 
             console.log({decode});
             req.user = decode ;
             console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

            // console.log(decode)  
            
         } catch (error) {
            console.log(error)
            return res.status(401).json({
                
                success: false,
                message:  "Invalid Token",
            })
         }

         next();
        } catch (error) {
            console.log(error)
        return res.status(500).json({
            success: false,
            message: "Somethiing went wrong while authenticating user",
        })
        
    }
}


//isStudent

export const isStudent = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Student only",
            })
        }
        

        
        next();
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "User role cannot be verified ",
        })
    }
}

//isInstructor
export const isInstructor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Instructor only",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};



//isAdmin
export const isAdmin = async (req:Request, res:Response, next:NextFunction)=>{  
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Admin only",
            })
        }
        

        next();
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "User role cannot be verified ",
        })
    }
}
import instance from "../config/razorpay";
import Course from "../models/Course";
import { Request, Response } from "express"
import User from "../models/User";
import mailSender from "../utils/mailSender";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail";
import mongoose from "mongoose";
import crypto from "crypto";



export const capturePayment = async (req: Request, res: Response)=>{

}

// Capture  the payment and initiate the Razorpy Order

// export const capturePayment = async (req: Request, res: Response) => {

//     try {
//         //  get courseId and userid
//         const { courseId } = req.body;
//         const userId = req.user.id;

//         // valid courseId
//         if (!courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please Provide valid course Id"
//             })
//         }
//         // valid courseDetails
//         const courseDetails = await Course.findById(courseId)
//         if (!courseDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course Details are not Valid"
//             })
//         }
//         // user already enrolled or not 
//         const uid = new mongoose.Types.ObjectId(userId);

//         if (courseDetails.studentsEnrolled.includes(uid)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already enrolled in this course"
//             })
//         }
//         // create order on Razorpay
//         const amount = courseDetails.price
//         if (!amount) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course price is not valid"
//             })
//         }
//         const currency = "INR";

//         const options = {
//             amount: amount * 100,
//             currency,
//             receipt: (Math.random().toString() + Date.now().toString()),
//             notes: {
//                 courseID: courseId,
//                 userId,
//             }
//         }

//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse)
//         // return response to frontend
//         return res.status(200).json({
//             success: true,
//             courseName: courseDetails.courseName,
//             courseDescription: courseDetails.courseDescription,
//             paymentResponse,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//             message: "payment Capture Successfully,Now you can enroll the course"
//         })

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error, Please try After Some time again",
//             error: error.message,
//         });
//     }

// }

export const verifySignature = async (req: Request, res: Response) => {

    try {

        const webhookSecret = "123456789";
        const signature = req.headers["x-razorpay-signature"]

        const shasum: crypto.Hmac = crypto.createHmac("sha256", webhookSecret)

        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex")

        if (signature === digest) {
            console.log("Payment is Authorised")

            const { courseId, userId } = req.body.payload.payment.entity.notes;


            // action 

            // find the course and enroll the student in that course
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )


            if (!enrolledCourse) {
                return res.status(400).json({
                    success: false,
                    message: "Course not found"
                })
            }
            console.log("Enrolled Course is", enrolledCourse)



            // find the Student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId
                    }
                },
                { new: true }
            );

            if (enrolledStudent) {
                // mail send to user that you have successfully Enrolled
                await mailSender(enrolledStudent.email, "Congratulation from StudyHub", "Congratulations, you are onboarded into new course")
            }


            return res.status(200).json({
                success: true,
                message: "Payment is Authorised and Course Enrolled Successfully"
            })

        }





    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error, Please try After Some time again",
            error: error.message,
        });
    }

}


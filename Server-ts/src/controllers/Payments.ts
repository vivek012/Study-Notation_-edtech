import instance from "../config/razorpay";
import Course from "../models/Course";
import { Request, Response } from "express"
import User from "../models/User";
import mailSender from "../utils/mailSender";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail";
import mongoose from "mongoose";
import crypto from "crypto";
import CourseProgress from "../models/CourseProgress";



export const capturePayment = async (req: Request, res: Response) => {
    const { courses } = req.body
    const userId = req.user.id
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
    }

    let total_amount = 0

    for (const course_id of courses) {
        let course
        try {
            // Find the course by its ID
            course = await Course.findById(course_id)

            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" })
            }

            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId)
            if (course?.studentsEnrolled.includes(uid)) {
                return res
                    .status(200)
                    .json({ success: false, message: "Student is already Enrolled" })
            }

            // Add the price of the course to the total amount
            if (course.price == null) {
                return res
                    .status(500)
                    .json({ success: false, message: "Course price is invalid" })
            }

            total_amount += course.price
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    }

    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random().toString() + Date.now().toString(),
    }

    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        res.json({
            success: true,
            data: paymentResponse,
        })
    } catch (error: any) {
        console.log(error)
        res
            .status(500)
            .json({ success: false, message: "Could not initiate order." })
    }
}


// verirfy the signature 
export const verifySignature = async (req: Request, res: Response) => {

        try {
            const razorpay_order_id = req.body?.razorpay_order_id
            const razorpay_payment_id = req.body?.razorpay_payment_id
            const razorpay_signature = req.body?.razorpay_signature
            const courses = req.body?.courses

            const userId = req.user.id

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature ||
                !courses ||
                !userId
            ) {
                return res.status(200).json({ success: false, message: "Payment Failed" })
            }

            let body = razorpay_order_id + "|" + razorpay_payment_id

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
                .update(body.toString())
                .digest("hex")

            if (expectedSignature === razorpay_signature) {
                await enrollStudents(courses, userId, res)
                return res.status(200).json({ success: true, message: "Payment Verified" })
            }
            

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error, Please try After Some time again",
                error: error.message,
            });
        }

    }

    
const enrollStudents = async (courses: string[], userId: string, res: Response) => {
      if (!courses || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide Course ID and User ID" })
      }
    
      for (const courseId of courses) {
        try {
          // Find the course and enroll the student in it
          const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { studentsEnroled: userId } },
            { new: true }
          )
    
          if (!enrolledCourse) {
            return res
              .status(500)
              .json({ success: false, error: "Course not found" })
          }
          console.log("Updated course: ", enrolledCourse)
    
          const courseProgress = await CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: [],
          } as any) as mongoose.Document & { _id: mongoose.Types.ObjectId }
          // Find the student and add the course to their list of enrolled courses
          const enrolledStudent = await User.findByIdAndUpdate(
            userId,    
            {
              $push: {
                courses: courseId,
                courseProgress: courseProgress?._id,
              },
            },
            { new: true }
          )
    
          if (!enrolledStudent) {
            return res.status(400).json({ success: false, error: "Student not found" });
          }
    
          console.log("Enrolled student: ", enrolledStudent)
          // Send an email notification to the enrolled student
          if (!enrolledStudent || !enrolledStudent.email) {
            return res.status(400).json({ success: false, error: "Student or student email not found" });
          }
          if (!enrolledStudent) {
            return res.status(400).json({ success: false, error: "Student not found" });
          }
          const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName ?? ""}`,
            courseEnrollmentEmail(
              enrolledCourse.courseName ?? "",
              `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
            )
          )
    
          console.log("Email  sent successfully: ", emailResponse?.response)
        } catch (error: any) {
          console.log(error)
          return res.status(400).json({ success: false, error: error.message })
        }
      }
    }


export const sendPaymentSuccessEmail = async (req: Request, res: Response) => {
      const { orderId, paymentId, amount } = req.body
     
      const userId = req.user.id
    
      if (!orderId || !paymentId || !amount || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide all the details" })
      }
    
      try {
        const enrolledStudent = await User.findById(userId)

        if (!enrolledStudent || !enrolledStudent.email) {
          return res
            .status(400)
            .json({ success: false, message: "Student or student email not found" })
        }

        
    
        await mailSender(
          enrolledStudent.email,
          `Payment Received`,
          paymentSuccessEmail(
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
            amount / 100,
            orderId,
            paymentId
          )
        )
      } catch (error) {
        console.log("error in sending mail", error)
        return res
          .status(400)
          .json({ success: false, message: "Could not send email" })
      }
    }





function paymentSuccessEmail(arg0: string, arg1: number, orderId: any, paymentId: any): string {
  throw new Error("Function not implemented.");
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

    // export const verifySignature = async (req: Request, res: Response) => {

    //     try {

    //         const webhookSecret = "123456789";
    //         const signature = req.headers["x-razorpay-signature"]

    //         const shasum: crypto.Hmac = crypto.createHmac("sha256", webhookSecret)

    //         shasum.update(JSON.stringify(req.body));
    //         const digest = shasum.digest("hex")

    //         if (signature === digest) {
    //             console.log("Payment is Authorised")

    //             const { courseId, userId } = req.body.payload.payment.entity.notes;


    //             // action 

    //             // find the course and enroll the student in that course
    //             const enrolledCourse = await Course.findOneAndUpdate(
    //                 { _id: courseId },
    //                 { $push: { studentsEnrolled: userId } },
    //                 { new: true }
    //             )


    //             if (!enrolledCourse) {
    //                 return res.status(400).json({
    //                     success: false,
    //                     message: "Course not found"
    //                 })
    //             }
    //             console.log("Enrolled Course is", enrolledCourse)



    //             // find the Student and add the course to their list of enrolled courses
    //             const enrolledStudent = await User.findOneAndUpdate(
    //                 { _id: userId },
    //                 {
    //                     $push: {
    //                         courses: courseId
    //                     }
    //                 },
    //                 { new: true }
    //             );

    //             if (enrolledStudent) {
    //                 // mail send to user that you have successfully Enrolled
    //                 await mailSender(enrolledStudent.email, "Congratulation from StudyHub", "Congratulations, you are onboarded into new course")
    //             }


    //             return res.status(200).json({
    //                 success: true,
    //                 message: "Payment is Authorised and Course Enrolled Successfully"
    //             })

    //         }





    //     } catch (error: any) {
    //         return res.status(500).json({
    //             success: false,
    //             message: "Internal Server Error, Please try After Some time again",
    //             error: error.message,
    //         });
    //     }

    // }


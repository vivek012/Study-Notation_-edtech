import mongoose from "mongoose";
import Course from "../models/Course";
import RatingAndReview from "../models/RatingAndReview";
import { Request, Response } from "express"




// Create Rating and Review
export const createRatingAndReview = async (req: Request, res: Response) => {
    try {
        // get user id 
        const userId = req.user.id
        // fetch data 
        const { rating, review, courseId } = req.body
        // check if user is enrolled or  not
        const cousreDetails = await Course.findOne({
            courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        })

        if (!cousreDetails) {
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in the course"
            })
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({ userId, courseId })

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course is Already reviewed by the user"
            })

        }
        // create rating and Review 
        const ratingAndReview = await RatingAndReview.create({
            rating, review, user: userId, course: courseId
        })
        // upadate course with rating and review 
        const updateCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id
                }
            },
            { new: true }
        )
        // return response 
        return res.status(200).json({
            success: true,
            message: "Rating and Review Created Successfully",
            ratingAndReview
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error ,Please try After Some time again",
            error: error.message,
        });
    }

}

// Get Average Rating
export const averageRating = async (req: Request, res: Response) => {
    try {
        //  get courseId
        const {courseId} = req.body

        // avg rating 
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg: "$ratings"}
                }
            },

        ])

        // return rating 
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            })
        }

        // if no rating /Review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating given till now ",
            averageRating: 0
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error ,Please try After Some time again",
            error: error.message,
        });
    }

}


// get all rating 
export const getAllRating = async (req: Request, res: Response) => {
    try {
       

        const allRating = await RatingAndReview.find()
        .sort({rating: "desc"})
        .populate({
            path:"user",
            select: "firstName lastname email image"
        })
        .populate({
            path: "course",
            select: "courseName",
        })
        .exec();


        return res.status(200).json({
            success: true,
            message: "All Review fetch successfully",
            data: allRating,
        })


    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error ,Please try After Some time again",
            error: error.message,
        });
    }

}
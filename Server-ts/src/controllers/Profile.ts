import mongoose from "mongoose";
import Profile from "../models/Profile";
import User from "../models/User";
import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload";
import uploadFilesToCloudinary from "../utils/Cloudinary";
import convertSecondsToDuration from "../utils/secToDuration";
import Course from "../models/Course";
import CourseProgress from "../models/CourseProgress";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    if (user) {
      await user.save()
    }

    // Update the profile fields
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error:any) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// delete Account  
export const deleteAccount = async (req: Request, res: Response) => {
    try {
        // get id 

        const id = req.user.id;

        // validate id 
        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User id is required",
            })
        }

        // delete profile
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);

        // unEnroll from all courses
        if (userDetails) { 
            (userDetails as any).coursesEnrolled = [];
            await userDetails.save();

        }


        // delete user 
        await User.findByIdAndDelete(id)
        // return response  
        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully",
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Account",
            error: error.message,
        });
    }
}

//  get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            users,
        })
    }catch (error: any) {
        return res.status(500).json({

            success: false,
            message: "Unable to fetch users",
            error: error.message,
        })
    }
}



export const updateDisplayPicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const displayPicture = req.files?.displayPicture

    if (!displayPicture) {
      return res.status(400).json({ success: false, message: "Display picture is required" })
    }

    const image = await uploadFilesToCloudinary(
      Array.isArray(displayPicture) ? displayPicture[0] : displayPicture,
      process.env.FOLDER_NAME ?? "studyHub",
      1000,
      1000
    )

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id


    const userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .exec()


    if (!userDetails) {
      return res.status(404).json({ success: false, message: `User not found: ${userId}` })
    }

    const user = userDetails.toObject() as any


    if (!user.courses?.length) {
      return res.status(200).json({ success: true, data: [] })
    }
 

    const enrichedCourses = await Promise.all(
   
      user.courses.map(async (course: any) => {
        const totalDurationInSeconds = course.courseContent.reduce(
          (total: number, section: any) =>
            total +
            section.subSection.reduce(
              (acc: number, sub: any) => acc + parseInt(sub.timeDuration),
              0
            ),
          0
        )

        const subsectionCount = course.courseContent.reduce(
          (acc: number, section: any) => acc + section.subSection.length,
          0
        )

        const courseProgress = await CourseProgress.findOne({
          courseID: course._id,
          userId,
        })
  

        const completedCount = courseProgress?.completedVideos?.length ?? 0
        const progressPercentage =
          subsectionCount === 0
            ? 100
            : Math.round((completedCount / subsectionCount) * 10000) / 100

        return {
          ...course,
          totalDuration: convertSecondsToDuration(totalDurationInSeconds),
          progressPercentage,
        }
      })
    )

    return res.status(200).json({ success: true, data: enrichedCourses })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const instructorDashboard = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })

    const courseData = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      totalStudentsEnrolled: course.studentsEnrolled.length,
      totalAmountGenerated: course.studentsEnrolled.length * (course.price ?? 0),
    }))

    return res.status(200).json({ success: true, courses: courseData })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
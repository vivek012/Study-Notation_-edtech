import Course from "../models/Course";
import { Request, Response } from "express"
import uploadFilesToCloudinary from "../utils/Cloudinary";
import User from "../models/User";
import Category from "../models/Category";

import { populate } from "dotenv";
import Section from "../models/Section";
import SubSection from "../models/SubSection";
import CourseProgress from "../models/CourseProgress";
import convertSecondsToDuration from "../utils/secToDuration";



// create course
// export const createCourse = async (req: Request, res: Response) => {
//   console.log("object")

//   try {
//     // fetch data
//     const { courseName, courseDescription, whatYouWillLearn, price, category, status, instructions } = req.body

//     // get Thumbnail
//     if (!req.files || !(req.files as any).thumbnail) {
//       return res.status(400).json({
//         success: false,
//         message: "Thumbnail is required"
//       })
//     }

//     const thumbnail = (req.files as any).thumbnail

//     console.log({ thumbnail })

//     // validation
//     if (!thumbnail || !courseName || !courseDescription || !whatYouWillLearn || !price || !category || !status || !instructions) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are Required"
//       })

//     }

//     // check for Instructor 
//     const userId = req.user.id;
//     const instructorDetails = await User.findById(userId)
//     console.log({ instructorDetails })

//     if (!instructorDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor Details not found"
//       })
//     }
//     // check given Category is valid or not
//     const categoryDetails = await Category.findById(category);
//     console.log({ categoryDetails })
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Details not Found"
//       })
//     }

//     // upload image to cloudinar
//     const ThumbnailImage = await uploadFilesToCloudinary(thumbnail, process.env.FOLDER_NAME || "studyHub", 300, 300)

//     console.log({ ThumbnailImage })
//     const instructionsArray = JSON.parse(instructions)
//     //  create a entry for new course 
//     const newCourse = await Course.create({
//       courseName,
//       courseDescription,
//       instructor: instructorDetails._id,
//       whatYouWillLearn,
//       thumbnail: ThumbnailImage.secure_url,
//       price,
//       category: categoryDetails._id,
//       status: status,
//       instructions: instructionsArray,
//     })
//     console.log({ newCourse })

//     // add course to user schema also
//     await User.findByIdAndUpdate(
//       { _id: instructorDetails._id },
//       {
//         $push: {
//           courses: newCourse._id,
//         }
//       },
//       { new: true }
//     )


//     // update Category schema also
//     await Category.findByIdAndUpdate(
//       { _id: categoryDetails._id },
//       {
//         $push: {
//           courses: newCourse._id,
//         }
//       }
//     )


//     return res.status(200).json({
//       success: true,
//       message: "Course Created Successfully",
//       data: newCourse
//     })
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

// }

export const createCourse = async (req: Request, res: Response) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files (use optional chaining to handle possibly undefined req.files)
    const thumbnail = (req.files as any)?.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId)

    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadFilesToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME || "studyHub",
      300,
      300
    )
    console.log(thumbnailImage)
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error: any) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}
// getAllCourse handler function
export const getAllCourses = async (req: Request, res: Response) => {

  try {
    // fetch Data

    const allCourses = await Course.find({}, {
      courseName: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      sudentsEnrolled: true,
    })
      .populate("instructor")
      .exec();


    return res.status(200).json({
      success: true,
      message: "All Course Return Successfully",
      data: allCourses,
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}
// get Course Details handler funcion
export const getCourseDetails = async (req: Request, res: Response) => {

  try {
    // get id 
    const { courseId } = req.body

    // get all CourseDetails 
    const courseDetails = await Course.findById(
      courseId
    )
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        }
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        }
      })
      .populate("ratingAndReviews")
      .populate("category")
      .populate("studentsEnrolled")
      .exec();


    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `COULD NOT FIND THE COURSE WITH ${courseId} `
      })
    }
    // return response
    res.status(200).json({
      success: true,
      message: "Successfully get all details of course",
      courseDetails
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}
// edit course 
export const editCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, ...updates } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({ error: "Course not found" })
      return
    }

    if (req.files?.thumbnailImage) {
      const thumbnailImage = await uploadFilesToCloudinary(
        Array.isArray(req.files.thumbnailImage) ? req.files.thumbnailImage[0] : req.files.thumbnailImage,
        process.env.FOLDER_NAME || "studyHub"
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    const JSON_FIELDS = new Set(["tag", "instructions"])

    for (const [key, value] of Object.entries(updates)) {
      (course as any)[key] = JSON_FIELDS.has(key) ? JSON.parse(value as string) : value
    }

    await course.save()

    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec()

    res.json({ success: true, message: "Course updated successfully", data: updatedCourse })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const getFullCourseDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    const [courseDetails, courseProgress] = await Promise.all([
      Course.findById(courseId)
        .populate({ path: "instructor", populate: { path: "additionalDetails" } })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({ path: "courseContent", populate: { path: "subSection" } })
        .exec(),
      CourseProgress.findOne({ courseID: courseId, userId }),
    ])

    if (!courseDetails) {
      res.status(404).json({ success: false, message: `Course not found: ${courseId}` })
      return
    }

    const totalDurationInSeconds = courseDetails.courseContent.reduce(
      (total, section: any) =>
        total + (section.subSection || []).reduce((sum: number, { timeDuration }: any) => sum + parseInt(timeDuration), 0),
      0
    )

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration: convertSecondsToDuration(totalDurationInSeconds),
        completedVideos: courseProgress?.completedVideos ?? [],
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const getInstructorCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorCourses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: instructorCourses })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" })
      return
    }

    await Promise.all([
      ...course.studentsEnrolled.map((studentId) =>
        User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } })
      ),
      ...course.courseContent.map(async (sectionId) => {
        const section = await Section.findById(sectionId)
        if (section) {
          await Promise.all(section.subSection.map((id) => SubSection.findByIdAndDelete(id)))
        }
        await Section.findByIdAndDelete(sectionId)
      }),
      Course.findByIdAndDelete(courseId),
    ])

    res.status(200).json({ success: true, message: "Course deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
import Course from "../models/Course";
import {Request , Response} from "express"
import uploadFilesToCloudinary from "../utils/Cloudinary";
import User from "../models/User";
import Category from "../models/Category";
import { populate } from "dotenv";



// create course
export const createCourse = async (req: Request , res:Response)=>{
  console.log("object")
 
  try {
    // fetch data
      const {courseName , courseDescription, whatYouWillLearn , price ,category} = req.body

      // get Thumbnail
      const {thumbnail} = req.files as any;

      console.log({thumbnail})

      // validation
      if(!thumbnail ||!courseName || !courseDescription  || !whatYouWillLearn  || !price  || !category){
        return res.status(400).json({
          success: false,
          message: "All fields are Required"
        })

      }

      // check for Instructor 
      const userId = req.user.id;
      const instructorDetails = await User.findById(userId)
      console.log({instructorDetails})
      
      if(!instructorDetails){
        return res.status(404).json({
          success:false,
          message: "Instructor Details not found"
        })
      }
      // check given Category is valid or not
      const categoryDetails = await Category.findById(category);
      console.log({categoryDetails})
      if(!categoryDetails){
        return res.status(404).json({
          success:false,
          message: "Category Details not Found"
        })
      }

      // upload image to cloudinar
      const ThumbnailImage = await uploadFilesToCloudinary(thumbnail, process.env.FOLDER_NAME || "studyHub", 300, 300)
      
console.log({ThumbnailImage})
//  create a entry for new course 
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      thumbnail: ThumbnailImage.secure_url,
      price,
      category: categoryDetails._id,        
    })
    console.log({newCourse})

    // add course to user schema also
    await User.findByIdAndUpdate(
      {_id : instructorDetails._id},
      {
        $push:{
          courses: newCourse._id,
        }
      },
      {new:true}
    )


    // update Category schema also
    await Category.findByIdAndUpdate(
      {_id: categoryDetails._id},
      {
        $push:{
          courses: newCourse._id,
        }
      }
    )


    return res.status(200).json({
        success:true,
        message: "Course Created Successfully",
        data: newCourse
    })
  } catch (error:any) {
     return res.status(500).json({
            success: false,
            message: error.message,
        });
  }

}

// getAllCourse handler function

export const getAllCourses = async (req: Request , res:Response)=>{
 
  try {
    // fetch Data

    const  allCourses = await Course.find({},{courseName:true,
                                              price:true,
                                              thumbnail:true,
                                              instructor:true,
                                              ratingAndReviews:true,
                                              sudentsEnrolled:true,})
                                              .populate("instructor")
                                              .exec(); 

    
    return res.status(200).json({
        success:true,
        message: "All Course Return Successfully",
        data : allCourses,
    })
   
  } catch (error:any) {
     return res.status(500).json({
            success: false,
            message: error.message,
        });
  }

}

// get Course Details handler funcion
export const getCourseDetails = async (req: Request , res:Response)=>{
 
  try {
    // get id 
    const {courseId} = req.body    

    // get all CourseDetails 
    const courseDetails = await Course.findById(
      courseId
    )
    .populate({
      path: "instructor",
      populate:{
        path: "additionalDetails",
      }
    })
    .populate({
      path: "courseContent",
      populate:{
        path: "subSection",
      }      
    })
    .populate("ratingAndReviews")
    .populate("category")
    .populate("studentsEnrolled")
    .exec();


    // validation
    if(!courseDetails){
      return res.status(400).json({
        success: false,
        message: `COULD NOT FIND THE COURSE WITH ${courseId} `
      })
    }
    // return response
    res.status(200).json({
      success:true,
      message: "Successfully get all details of course",
      courseDetails
    })
   
  } catch (error:any) {
     return res.status(500).json({
            success: false,
            message: error.message,
        });
  }

}

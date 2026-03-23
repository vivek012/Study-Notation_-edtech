import { validateHeaderName } from "node:http";
import Profile from "../models/Profile";
import User from "../models/User";
import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload";
import uploadFilesToCloudinary from "../utils/Cloudinary";
import convertSecondsToDuration from "../utils/secToDuration";




// Profile Update 

// export const updateProfile = async (req: Request, res: Response) => {

//     try {
//         // get data 
//         const { dateOfBirth = "", about = "", contactNumber, gender } = req.body

//         //  get userId 
//         const id = req.user.id;

//         //  Validate 
//         if (!contactNumber || !gender || !id) {
//             return res.status(200).json({
//                 success: false,
//                 message: "All fields are Required",
//             })

//         }

//         //  find profile
//         const userDetails = await User.findById(id)
//         const profileId = userDetails?.additionalDetails;
//         const profileDetails = await Profile.findById(profileId)

//         // update profile
//         if (profileDetails) {
//             profileDetails.dateOfBirth = dateOfBirth;
//             profileDetails.about = about;
//             profileDetails.contactNumber = contactNumber;
//             profileDetails.gender = gender;
//             await profileDetails.save();
//         }



//         //  return response
//         return res.status(200).json({
//             success: true,
//             message: "Profile Update Successfully",
//             profileDetails

//         })
//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Unbale to Update Profile , Please try again later",
//             error: error.message,
//         });
//     }

// }

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


// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//   };
//   files?: any;
// }

// export const updateDisplayPicture = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     // ✅ Check file exists
//     if (!req.files || !req.files.displayPicture) {
//       return res.status(400).json({
//         success: false,
//         message: "Display picture is required",
//       });
//     }

//     const displayPicture = req.files.displayPicture;
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // ✅ Upload to cloudinary
//     const image = await uploadFilesToCloudinary(
//       displayPicture,
//       process.env.FOLDER_NAME as string,
//       1000,
//       1000
//     );

//     // ✅ Update user
//     const updatedProfile = await User.findByIdAndUpdate(
//       userId,
//       { image: image.secure_url },
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Image updated successfully",
//       data: updatedProfile,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };





// export const getEnrolledCourses = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const userDetails = await User.findById(userId)
//       .populate({
//         path: "coursesEnrolled",
//         model: "Course",
//         populate: {
//           path: "courseContent",
//           model: "Section",
//           populate: {
//             path: "subSection",
//             model: "SubSection",
//           },
//         },
//       })
//       .lean();

//     if (!userDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     for (let course of userDetails.coursesEnrolled) {
//       let totalDurationInSeconds = 0;
//       let totalSubsections = 0;

//       for (let section of course.courseContent) {
//         const sectionDuration = section.subSection.reduce(
//           (acc: number, curr: any) =>
//             acc + parseInt(curr.timeDuration || "0"),
//           0
//         );

//         totalDurationInSeconds += sectionDuration;
//         totalSubsections += section.subSection.length;
//       }

//       course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

//       const progress = await CourseProgress.findOne({
//         courseID: course._id,
//         userId: userId,
//       });

//       const completedCount =
//         progress?.completedVideos?.length || 0;

//       if (totalSubsections === 0) {
//         course.progressPercentage = 100;
//       } else {
//         course.progressPercentage = Number(
//           ((completedCount / totalSubsections) * 100).toFixed(2)
//         );
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       data: userDetails.coursesEnrolled,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

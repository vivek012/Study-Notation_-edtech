import SubSection from "../models/SubSection";
import Section from "../models/Section";
import Course from "../models/Course";
import { Request, Response } from "express"
import  uploadFilesToCloudinary  from "../utils/Cloudinary";






// create subSection
export const createSubSection = async (req: Request, res: Response) => {
    try {

        // fetch data from req body
        const { sectionId, title, description, timeDuration } = req.body

        // extract file/video 
        const video = (req as any).files.videoFiles;

        console.log(video)
        // validation
        if (!sectionId || !title || !description || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "All Field Required"
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadFilesToCloudinary(video, process.env.FOLDER_NAME || "studyHub", 300, 300)
        console.log({ secure_url: uploadDetails.secure_url})
        // create a subsection 
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })

        console.log({subSectionDetails})
        // update section with this subsection Objectid 
        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSection: subSectionDetails._id
            }

        }, { new: true })
            .populate({
                path: "subSection"
            })
            console.log(updatedSectionDetails)

        // return response 

        return res.status(200).json({
            success: true,
            message: "Sub Section created Successfully",
            updatedSectionDetails
        })


    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Create Sub Section , Please try again later",
            error: error.message,
        });
    }

}


//  Update sub Section
export const updateSubSection = async (req: Request, res: Response) => {

    try {
        const { sectionId, title, description, videoUrl, timeDuration } = req.body

        const video = (req as any).files.videoFiles;

        // validate data 
        if (!sectionId || !title || !description || !videoUrl || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are Required"
            })
        }

        //  upload to cloudinary 
        const updatedVideo = await uploadFilesToCloudinary(video, process.env.FOLDER_NAME  || "studyHub", 300, 300)

        // updating sub Section 

        const updatedSubSection = await SubSection.findByIdAndUpdate(sectionId, {
            title,
            description,
            timeDuration,
            videoUrl: updatedVideo.secure_url
        }, { new: true })

        // return response 
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updatedSubSection,
        })


    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Update sub Section , Please try After Some time ",
            error: error.message,
        });
    }

}

// delete subsection 
export const deleteSubSection = async (req: Request, res: Response) => {
    try {

        //  get id - assuming that we are sending ID in params
        const { subSectionId } = req.params
        // data validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        // delete data 

        const deleteSection = await Section.findByIdAndUpdate(subSectionId)
        // return response 

        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",

        })


    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Delete  sub Section , Please try After Some time again",
            error: error.message,
        });
    }

}
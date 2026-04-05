import SubSection from "../models/SubSection";
import Section from "../models/Section";
import Course from "../models/Course";
import { Request, Response } from "express"
import uploadFilesToCloudinary from "../utils/Cloudinary";






// create subSection
export const createSubSection = async (req: Request, res: Response) => {
    try {

        // fetch data from req body
        const { sectionId, title, description } = req.body

        // extract file/video 
        const video = (req as any).files.video;

        console.log(video)
        // validation
        if (!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All Field Required"
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadFilesToCloudinary(video, process.env.FOLDER_NAME || "studyHub", 300, 300)
        console.log({ secure_url: uploadDetails.secure_url })
        // create a subsection 
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration: `${uploadDetails.duration}`,
            description,
            videoUrl: uploadDetails.secure_url
        })

        console.log({ subSectionDetails })
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
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
        // const video = (req as any).files.videoFiles;

        // validate data 
        if (!subSection) {
            return res.status(400).json({
                success: false,
                message: "Sub Section not Found"
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video



            //  upload to cloudinary 
            const uploadDetails = await uploadFilesToCloudinary(
                video,
                process.env.FOLDER_NAME || "studyHub", 300, 300
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }



        await subSection.save()

        // updating sub Section 

        const updateSection = await Section.findById(sectionId).populate("subSection")

        // return response 
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updateSection,
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
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }


         const updatedSection = await Section.findById(sectionId).populate(
              "subSection"
            )

        // return response 

        return res.status(200).json({
            success: true,
            message: " Sub Section Deleted Successfully",
            updatedSection
        })


    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Delete  sub Section , Please try After Some time again",
            error: error.message,
        });
    }

}
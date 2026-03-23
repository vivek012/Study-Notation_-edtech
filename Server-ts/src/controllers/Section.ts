import Section from "../models/Section";
import Course from "../models/Course";
import { Request,  Response } from "express"






// create Section
export const createSection = async (req: Request, res: Response) => {

    try {
        // fetch data
        const { sectionName, courseId } = req.body;
        // data validation 
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        // create Section
        const newSection = await Section.create({ sectionName })
        // update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true },
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        // return response
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourseDetails,
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Create Section , Please try again",
            error: error.message,
        });
    }

}


//  Update a Section
export const updateSection = async (req: Request, res: Response) => {
    try {
        //  data input
        const { sectionName, sectionId } = req.body
        // data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        // update data 
        const updateSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})
        // return response 

         return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updateSection,
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Update Section , Please try After Some time again",
            error: error.message,
        });
    }

}

// delete section 
export const deleteSection = async (req: Request, res: Response) => {
    try {
        //  get id - assuming that we are sending ID in params
        const {  sectionId } = req.params
        // data validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        // delete data 

        const deleteSection = await Section.findByIdAndUpdate(sectionId)
        // return response 

         return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
           
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Update Section ,Please try After Some time again",
            error: error.message,
        });
    }

}
import Section from "../models/Section";
import Course from "../models/Course";
import SubSection from "../models/SubSection";
import { Request, Response } from "express"

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
            .exec();
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
        const { sectionName, sectionId, courseId } = req.body

        // update data 
        const updateSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })
        // return response 

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        res.status(200).json({
            success: true,
            message: updateSection,
            data: course,
        });

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
        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not Found",
            })
        }

        //delete sub section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Unbale to Update Section ,Please try After Some time again",
            error: error.message,
        });
    }

}
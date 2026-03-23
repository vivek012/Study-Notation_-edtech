import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import Button from './Button'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
    return (
        <div className='mt-20'>
            <div className="flex gap-20 items-center">
                <div className="w-[50%]">
                    <img className='shadow-[-20px_-20px_1px_rgba(255,255,255)]' src={Instructor} alt="" />
                </div>
                <div className="w-[50%] flex flex-col gap-10">
                    <div className="text-4xl font-semibold w-[50%]">
                        Become an
                        <HighlightText text={"Instructor"} />
                    </div>
                    <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                        Instructors from around the world teach millions of students on StudyNotion. We provide the
                        tools and skills to teach what you love.|
                    </p>

                    <div className="w-fit">

                        <Button active={true} linkto={"./signup"} >
                            <div className=" flex items-center gap-3">
                                Start Learning Today
                                <FaArrowRight />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default InstructorSection;

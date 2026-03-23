import React from 'react'
import HighlightText from './HighlightText'
import knowYourProgress from "../../../assets/Images/know_your_progress.png"
import compareWithOthers from "../../../assets/Images/Compare_with_others.png"
import planYourLesson from "../../../assets/Images/plan_your_lessons.png"
import CTAButton from "./Button"


const LearningLanguageSection = () => {
  return (
    <div className='mt-32.5  '>
        <div className="  flex flex-col gap-5 items-center">
            <div className="text-4xl font-semibold text-center "> 
                Your Swiss Knife for 
                <HighlightText text={"learning any language"}/>
            </div>

            <div className="text-center text-richblack-600 mx-auto text text-base mt-3 font-medium w-[70%]">
                Using spin making learning multiple language easy. with 20+ language realistic voice-over, progress tracking custom schedule and more 
            </div>

            <div className="flex items-center justify-center mt-5 ">
                <img src={knowYourProgress} alt="knowYourProgressImage" className='object-contain -mr-28' />
                <img src={compareWithOthers} alt="compareWithOthersImage" className='object-contain' /> 
                <img src={planYourLesson} alt="planYourLessonImage" className='object-contain -ml-36   ' />
            </div>
            <div className=" w-fit">
                <CTAButton active={true} linkto={"./signup"}>learn more</CTAButton>
            </div>
        </div>
      
    </div>
  )
}

export default LearningLanguageSection

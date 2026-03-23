import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import HighlightText from './HighlightText'
import CourseCard from './CourseCard'




const tabsname = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",


]


const ExploreMore = () => {

  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentTab, setCurrentTab] = useState(tabsname[0]);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);




  const setMyCard = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value)

    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  }


  return (
    <div>
      <div className="text-4xl font-semibold text-center">
        Unlock the
        <HighlightText text={"Power of Code"} />
      </div>
      <div className=" text-center text-richblue-300 text-sm   mt-3">Learn to build anything you can imagine</div>

      
      <div className="p-1 gap-1.5  m-5 flex rounded-full bg-richblack-800">
        {
          tabsname.map((element, index)=>{
            return (
              <div className={`text-[16px] flex items-center gap-5 ${currentTab===element? "bg-richblack-900 text-richblack-5 font-medium": "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-5 py-2 `} key={index}
              onClick={()=>setMyCard(element)}>
                {element}
              </div> 
            )
          })
        }
      </div>
      <div className="hidden lg:block lg:h-50"></div>
        {/* Course Card  */}
        <div className=" lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
          {
            courses.map((ele, i)=>{
              return (
               <CourseCard
               key={i}
               cardData ={ele}
               currentCard ={currentCard}
               setCurrentCard = {setCurrentCard}
               />
              )
            })
          }
        </div>

    </div>
  )
}

export default ExploreMore;

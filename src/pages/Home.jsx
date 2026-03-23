import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import HighlightText from "../components/core/HomePage/HighlightText"
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import Footer from "../components/common/Footer"
import ExploreMore from "../components/core/HomePage/ExploreMore"







const Home = () => {
    return (
        <div>
            {/* SECTION 1 */}
            <div className=" relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
                <Link to={"/signup"}>
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center justify-center gap-2  rounded-full px-10 py-1.25 text-sm transition-all duration-200 group-hover:bg-richblack-900 ">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl  font-semibold mt-7">Empower Your Future with <HighlightText text={"Coding Skills"} /></div>

                <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.</div>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
                </div>

                {/* Demo video  */}

                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video muted loop autoPlay src={Banner} type="video/mp4/" className="shadow-[20px_20px_rgba(255,255,255)]"></video>
                </div>

                {/* code Section 1  */}

                <div className="">
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock Your{" "}
                                <HighlightText text={"Coding Potential"} />{" "}
                                with our Online Courses
                            </div>
                        }
                        subHeading={
                            "Our Courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with You "
                        }
                        ctabtn1={
                            {
                                btnText: "try it Yourself",
                                linkto: "/signup",
                                active: true
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn more",
                                linkto: "/login",
                                active: false
                            }
                        }

                        codeblock={`<!DOCTYPE html> \n <html lang="en">\n <head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        codeColor={"text-yellow-25"}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                {/* code Section 2  */}
                <div className="">
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Start{" "}
                                <HighlightText text={`\n Coding \n in seconds`} />{" "}
                            </div>
                        }
                        subHeading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText: "Continue Lesson",
                                linkto: "/signup",
                                active: true
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn more",
                                linkto: "/login",
                                active: false
                            }
                        }

                        codeblock={`<!DOCTYPE html> \n <html lang="en">\n <head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        codeColor={"text-yellow-25"}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                    <ExploreMore/>
            </div>


            {/* SECTION 2 */}
            <div className="bg-pure-greys-5 text-richblack-700 pb-16">
                <div className="homepage_bg  h-96 w-full">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto">
                        <div className="h-52"></div>
                        <div className="flex gap-5 text-white">
                            <CTAButton active={true} linkto={"./signup"}>
                                <div className="flex items-center gap-3">
                                    Explore full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"./signup"}>
                                <div className="flex items-center gap-3">
                                    learn more
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="mt-16 mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-7">
                    <div className="flex gap-24">
                        <div className="text-4xl font-semibold w-[45%]">Get the Skills you need for a
                            <HighlightText text={"Job that is in demand"} />
                        </div>
                        <div className="flex flex-col w-[45%] items-start ">

                            <p className=" mb-12 text-[16px]">The modern Study Hub is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills. </p>
                            <CTAButton active={true} linkto={"./signup"}>Learn more</CTAButton>

                        </div>
                    </div>


                    <TimelineSection />
                    <LearningLanguageSection />
                </div>


            </div>


            {/* SECTION 3 */}
            <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">

                        <InstructorSection/>

                        <h2 className="text-center text-4xl font-semibold mt-10"> Review from Other Learners </h2>

            </div>


            {/* FOOTER */}
            <Footer/>
        </div>
    )
}

export default Home

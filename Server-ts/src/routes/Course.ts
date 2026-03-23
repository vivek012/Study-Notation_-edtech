import { Router } from "express";
import { auth, isInstructor, isStudent } from "../middlewares/auth";
import { createCourse, getAllCourses, getCourseDetails } from "../controllers/Course";
import { createSection, deleteSection, updateSection } from "../controllers/Section";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/subSection";
import { averageRating, createRatingAndReview, getAllRating } from "../controllers/RatingAndReview";
import { categoryPageDetails, createCategory, showAllCategory } from "../controllers/Category";

const courseRouter = Router();

courseRouter.post("/createCourse", auth, isInstructor, createCourse)
courseRouter.post("/addSection", auth, isInstructor, createSection)
courseRouter.put("/updateSection", auth, isInstructor, updateSection)
courseRouter.delete("/deleteSection", auth, isInstructor, deleteSection)
courseRouter.post("/updateSubSection", auth, isInstructor, updateSubSection)
courseRouter.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)
courseRouter.post("/addSubSection", auth, isInstructor, createSubSection)
courseRouter.get("/getAllCourses", getAllCourses)
courseRouter.post("/getCourseDetails", getCourseDetails)

// category Routes



courseRouter.post("/createCategory", createCategory)
courseRouter.get("/showAllCategories", showAllCategory )
courseRouter.get("/getCategoryPageDetails", categoryPageDetails)




// Rating and Review 
courseRouter.post("/createRating", auth, isStudent, createRatingAndReview)
courseRouter.get("/createAverageRating", auth, isStudent, averageRating)
courseRouter.get("/getReview", auth, isStudent, getAllRating)

export default courseRouter;
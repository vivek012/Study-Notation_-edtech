import { Router } from "express";
import { deleteAccount, getAllUsers, getEnrolledCourses, instructorDashboard, updateDisplayPicture, updateProfile } from "../controllers/Profile";
import { auth, isInstructor } from "../middlewares/auth";

const profileRouter = Router();

//------------------------- Profile Route ----------------------

// Delete User Account 
profileRouter.delete("/deleteProfile", auth,  deleteAccount)
profileRouter.put("/updateProfile", auth, updateProfile)
profileRouter.get("/getUserDetails", auth,  getAllUsers)


// Get  Enrolled Courses
profileRouter.get("/getEnrolledCourses", auth, getEnrolledCourses)
profileRouter.put("/updateDisplayPicture", auth, updateDisplayPicture)
profileRouter.get("/instructorDashboard", auth, isInstructor, instructorDashboard)






export default profileRouter; 
import { Router } from "express";
import { deleteAccount, getAllUsers, updateProfile } from "../controllers/Profile";
import { auth } from "../middlewares/auth";

const profileRouter = Router();

profileRouter.delete("/deleteProfile", auth,  deleteAccount)
profileRouter.put("/updateProfile", auth, updateProfile)
profileRouter.get("/getUserDetails", auth,  getAllUsers)
// profileRouter.get("/deleteProfile", deleteAccount)
// profileRouter.delete("/deleteProfile", deleteAccount)




export default profileRouter; 
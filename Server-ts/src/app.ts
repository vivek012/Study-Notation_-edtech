import dotenv from "dotenv";
import path from "path/win32";

dotenv.config({ path: path.resolve(__dirname, ".env") });
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'

import fileUpload from "express-fileupload"


import userRouter from "./routes/User";
import profileRouter from "./routes/Profile";
import paymentRouter from "./routes/Payments";
import courseRouter from "./routes/Course";



const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // React / frontend URL
    credentials: true,               // allow cookies / auth headers
  })
); 

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)


app.use("/api/v1/auth", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/course", courseRouter);



export default  app;
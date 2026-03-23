import mongoose from "mongoose";


console.log(process.env.MONGODB_URL)

export const connectDB = () => {

    mongoose.connect(process.env.MONGODB_URL!)
        .then(() => console.log("DB connected Successfully"))
        .catch((error) => {
            console.log("DB Connection Failed");
            console.error(error)
            process.exit(1)
        })
};
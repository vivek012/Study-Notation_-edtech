import app from "./app";
import { connectDB } from "./config/db";

console.log(process.env.MONGODB_URL)


 
const PORT = process.env.PORT! 
connectDB();
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})

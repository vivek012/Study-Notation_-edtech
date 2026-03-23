


import Razorpay from "razorpay";


// if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
//   throw new Error("Razorpay ENVhii variables missing");
// }

// console.log("KEY:", process.env.RAZORPAY_KEY);
// console.log("SECRET:", process.env.RAZORPAY_SECRET);


 const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
})

export default instance;
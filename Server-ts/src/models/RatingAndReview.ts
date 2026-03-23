import mongoose from "mongoose";
const RatingAndReviewSchema =new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
   },
   rating:{
    type:Number,
    required:true 
   },
   review:{
    type:String,
    required:true 
   },
   course:{
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: "Course",
      index:true,
   }
});

const RatingAndReview = mongoose.model('RatingAndReview', RatingAndReviewSchema)

export  default RatingAndReview;
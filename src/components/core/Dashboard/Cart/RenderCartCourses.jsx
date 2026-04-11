import React from 'react'
import { FaStar } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component";
import { removeFromCart } from '../../../../slices/cartSlice';


const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    return (
        <div className='flex flex-1 flex-col'>
            {
                cart.map((course, i) => (
                    <div className={`flex w-full flex-wrap items-start justify-between gap-6 ${i !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
                        } ${i !== 0 && "mt-6"} `} key={i}>
                        <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                            <img src={course?.thumbnail} alt="" className="h-37 w-55 rounded-lg object-cover" />
                            <div className="flex flex-col space-y-1">
                                <p className="text-lg font-medium text-richblack-5">{course?.courseName}</p>
                                <p className="text-sm text-richblack-300">{course?.category?.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className='text-yellow-5'>4.8</span>
                                    <ReactStars
                                        count={5}
                                        value={course?.ratingAndReviews?.length}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                    />
                                    <span className='text-richblack-400'>
                                        {course?.ratingAndReviews?.length} Ratings
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <button
                                className='flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-3 text-pink-200'
                                onClick={() => dispatch(removeFromCart(course._id))}
                            >
                                <RiDeleteBin6Line />
                                <span>Remove</span>
                            </button>
                            <p className="mb-6 text-3xl font-medium text-yellow-100">
                                ₹ {course?.price}
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RenderCartCourses

import React from 'react'
import { useSelector } from 'react-redux'
import IconButton from '../../../common/IconButton'

const RenderTotalAmount = () => {
  const {total, cart}= useSelector((state)=> state.cart)


  const handleBuyCourse= ()=>{
    const courses = cart.map((course)=> course._id)
    console.log("Bought theses courses: ", courses)
    // TODO : payment gateway integration

  }
  return (
    <div className='min-w-70 rounded-md border border-richblack-700 bg-richblack-800 p-6'>
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
    <p className="mb-6 text-3xl font-medium text-yellow-100">Rs {total}</p>
    <IconButton
    text={"Buy Now"}
    onclick={handleBuyCourse}
    customClasses="w-full justify-center"
    />
    </div>
  )
}

export default RenderTotalAmount

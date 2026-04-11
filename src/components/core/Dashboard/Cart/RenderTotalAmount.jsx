import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../../../common/IconButton'

import { buyCourse } from '../../../../services/operations/StudentFeaturesAPI'
import { useNavigate } from 'react-router-dom'

const RenderTotalAmount = () => {
  const {total, cart}= useSelector((state)=> state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch() 

  const handleBuyCourse= ()=>{
    const courses = cart.map((course)=> course._id)
    console.log("Bought theses courses: ", courses)
    // TODO : payment gateway integration
    buyCourse(token , courses, user,  navigate, dispatch)

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

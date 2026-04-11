import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import Tab from '../../common/Tab';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import toast, { Toaster } from 'react-hot-toast';
import {setSignupData } from '../../../slices/authSlice';
import { sendOtp } from '../../../services/operations/authAPI';






const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword :"",
  })


const [showPassword, setShowPassword] = useState(false)  
const [showConfirmPassword, setShowConfirmPassword] = useState(false)  

const {firstName, lastName, email, password,  confirmPassword} = formData

// Handle input field when some value changes

const handleOnChange=(e)=>{
  setFormData((prevData) =>({
    ...prevData,
    [e.target.name]: e.target.value
  }))
}

const handleOnSubmit =(e) =>{
  e.preventDefault()

  if(password != confirmPassword){
    toast.error("passwords Do not match")
  }

  const signupData ={
    ...formData,
    accountType
  }

  dispatch(setSignupData(signupData))
  dispatch(sendOtp(formData.email, navigate))

  setFormData({
    firstName: "",
    lastName:"",
    email:"",
    password:"",
    confirmPassword: "",
  })
  setAccountType(ACCOUNT_TYPE.STUDENT)
}

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]


  return (
    <div>
      {/* Tab   */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form className='' onSubmit={handleOnSubmit} >
        <div className="flex gap-x-4">
          <label>
            <p className='mb-1 text-[0.875rem] text-richblack-5 leading-5.5'>First Name <sup className='text-pink-200'>*</sup> </p>
            <input
            required 
            type="text"
            name='firstName'
            value={firstName}
            placeholder='Enter First Name'
            onChange={handleOnChange}
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }} 
            className='w-full rounded-lg text-richblack-5 bg-richblack-800 p-3' 
            />
          </label>
          <label>
            <p className='mb-1 text-[0.875rem] leading-5.5 text-richblack-5'>Last Name <sup className='text-pink-200'>*</sup> </p>

              <input 
              required
              type="text" 
              name='lastName'
              value={lastName}
              placeholder='Enter Last Name'
              onChange={handleOnChange}
              style={{boxShadow: "inset 0px -1px 0px rgba(255,255,255, 0.18)"}}
              className='w-full rounded-lg text-richblack-5  p-3 bg-richblack-800'
              />
          </label>
        </div>
        <label className='w-full'>
          <p className='mb-1 text-[0.875rem] leading-5.5 text-richblack-5'>Email Address <sup className='text-pink-200'>*</sup> </p>
              <input
              required
              type="email" 
              name='email'
              value={email}
              placeholder='Enter Email Address'
              onChange={handleOnChange}
              style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
              className='w-full rounded-lg text-richblack-5 bg-richblack-800 p-3'
              />

        </label>
        <div className="flex gap-x-4">
          <label className='relative' >
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">Create Password  <sup className='text-pink-200'>*</sup></p>
            <input 
            required
            type={showPassword? "text": "password"} 
            name='password'
            value={password}
            onChange={handleOnChange}
            placeholder='Enter Password'
             style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
              className='w-full rounded-lg text-richblack-5 bg-richblack-800 p-3'
            />
             <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 z-10 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>

            
          </label>
          <label className='relative' >
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">Confirm Password  <sup className='text-pink-200'>*</sup> </p>

            <input 
            required
            type={showConfirmPassword? "text" : "password"} 
            name='confirmPassword'
            value={confirmPassword}
            placeholder='Enter Confirm Password'
            onChange={handleOnChange}
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5"
            />

            <span 
            onClick={()=>setShowConfirmPassword((prev)=> !prev)}
            className="absolute right-3 top-9.5 z-10 cursor-pointer"
            >
              {showConfirmPassword? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"  />
              ):(
                <AiOutlineEye fontSize={24} fill="#AFB2BF"  />
              )}
            </span>
          </label>
        </div>
        <button type='submit' className="w-full mt-6 max-w-maxContent cursor-pointer rounded-lg bg-yellow-50 py-2  px-3 font-medium text-richblack-900">Create Account</button>
      </form>
      
    </div>
  )
}

export default SignupForm;

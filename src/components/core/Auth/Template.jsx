import React from 'react'
import { useSelector } from 'react-redux'
import frameImg from '../../../assets/Images/frame.png'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'


const Template = ({title , description1, description2, image , 
    formType
}) => {

    const {loading} = useSelector((state) => state.auth)
  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading? (
                <div className="spinner"></div>
            ) : (
                <div className=" flex mx-auto max-w-maxContent w-11/12 justify-between flex-col-reverse gap-y-12 py-12 md:flex-row md:gap-y-0">
                    <div className="mx-auto w-11/12  max-w-112.5 md:mx-0 text-yellow-25">
                    <h1 className='text-[1.875rem] font-semibold leading-9.5 text-richblack-5'>{title}</h1>
                    <p className='mt-4 text-[1.125rem] leading-6.5'>
                        <span className="text-richblack-100">{description1}</span> {" "}
                        <span className="text-blue-100 italic font-edu-sa font-bold">{description2}</span>
                    </p>
                    {
                        formType ==="signup" ? <SignupForm/> : <LoginForm/>
                    }
                    </div>
                    <div className="relative mx-auto w-11/12 max-w-112.5">
                        <img 
                        src={frameImg} 
                        alt="Pattern" 
                        width={558}
                        height={504}
                        loading='lazy'
                        />
                        <img 
                        src={image} 
                        alt="Pattern" 
                        width={558}
                        height={504}
                        loading='lazy'
                        className='absolute -top-4 right-4 z-10'
                        />
                    </div>
                </div>
            )
        }

      
    </div>
  )
}

export default Template

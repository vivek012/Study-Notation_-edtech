import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux'
import { RxCountdownTimer } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signUp } from '../services/operations/authAPI';





const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { signupData, loading } = useSelector((state) => state.auth)


    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    }, [signupData, navigate])


    const handleVerifyAndSignup = (e) => {
        e.preventDefault()


        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData

        dispatch(signUp(accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate))
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            {
                loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="max-w-125 p-4 lg:p-8">
                        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-9.5">Verify Email</h1>
                        <p className="text-[1.125rem] leading-6.5 my-4 text-richblack-100"> A Verification code has been sent  to you . Enter the code below </p>

                        <form onSubmit={handleVerifyAndSignup} >
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                renderInput={(props) => <input {...props}
                                    placeholder="_"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="w-12 lg:w-15 border-0 bg-richblack-800 rounded-lg text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                />}
                                containerStyle={{
                                    justifyContent: "space-between",
                                    gap: "0 6px",
                                }}
                            />
                            <button type='submit' className="w-full bg-yellow-50 py-3 px-3 rounded-lg mt-6 font-medium text-richblack-900">
                                Verify Email
                            </button>

                        </form>
                        <div className="mt-6 flex items-center justify-between">

                            <Link to={"/login"}>
                                <p className="flex items-center gap-x-2 text-richblack-5">
                                    <BiArrowBack />
                                    Back to login</p>
                            </Link>

                            <button className="flex items-center text-blue-100 gap-x-2" onClick={() => { dispatch(sendOtp(signupData.email, navigate)) }}><RxCountdownTimer />
                                Resend it</button>

                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default VerifyEmail

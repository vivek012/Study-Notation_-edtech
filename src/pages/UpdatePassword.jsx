import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BiArrowBack } from "react-icons/bi"
import { resetPassword } from "../services/operations/authAPI"




const UpdatePassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const { loading } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    })

    const { newPassword, confirmNewPassword } = formData

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)




    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))

    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const token = location.pathname.split("/").at(-1)
        dispatch(resetPassword(newPassword, confirmNewPassword, token))


    }


    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="max-w-125 p-4 lg:p-8">
                        <h1 className="text-[1.875rem] font-semibold leading-9.5 text-richblack-5">Choose new Password</h1>
                        <p className="my-4 text-[1.125rem] leading-6.5 text-richblack-100">Almost done. Enter your new password and youre all set. </p>

                        <form className="gap-y-5" onSubmit={handleOnSubmit} >
                            <label className="relative">
                                <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">new Password <sup className="text-pink-200">*</sup> </p>

                                <input
                                    required
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handleOnChange}
                                    placeholder="new password"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className='mb-4 w-full rounded-lg text-richblack-5 bg-richblack-800 p-3'
                                />
                                <span onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-3 top-9.5 z-10 cursor-pointer">
                                    {
                                        showNewPassword ? (
                                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                        ) : (
                                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                        )
                                    }
                                </span>
                            </label>
                            <label className="relative ">
                                <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">Confirm new Password <sup className="text-pink-200">*</sup> </p>

                                <input
                                    required
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    name="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={handleOnChange}
                                    placeholder="confirm new password"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className='mb-4 w-full rounded-lg text-richblack-5 bg-richblack-800 p-3'
                                />
                                <span onClick={() => setShowConfirmNewPassword((prev) => !prev)} className=" absolute right-3 top-22 z-10 cursor-pointer">
                                    {
                                        showConfirmNewPassword ? (
                                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                        ) : (
                                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />

                                        )
                                    }
                                </span>


                            </label>
                            <button type="submit" className=" w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900">Reset Password</button>
                        </form>
                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login" >
                                <p className="flex items-center gap-x-2 text-richblack-5">Back To Login
                                    <BiArrowBack />
                                </p></Link>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default UpdatePassword

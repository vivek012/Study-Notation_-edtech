import toast from "react-hot-toast"
import { setLoading, setToken } from '../../slices/authSlice'
import { apiConnector } from "../apiconnector";
import { endpoints } from "../api";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";

const { LOGIN_API, SIGNUP_API, SENDOTP_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints



export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true
      })
      console.log("otp.....................")
      console.log("SEND OTP API RESPONSE.............", response)
      console.log(response.data.success)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SEND OTP ERROR ..................", error)
      toast.error("Could Not Send OTP")



    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup") 
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading....")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password })
      console.log("LOGIN API RESPONSE......", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successfull")
      dispatch(setLoading(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("dashboard/my-profile")

    } catch (error) {
      console.log("LOGIN API ERROR ..........", error)
      toast.error("Login Failed")

    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export  function logout(navigate) {
  return async (dispatch)=>{
    const toastId = toast.loading("loading...")
    setLoading(true)
    try {
      dispatch(setToken(null))
      dispatch(setUser(null))
      dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("Logged Out")
      navigate("/")

      
      
    } catch (error) {
      console.log("LOGOUT FAILED............." ,error)
      toast.error("Unable to Logout , Try Again Later")
      
    }
    setLoading(false)
    toast.dismiss(toastId)
    

  }
}

export const getPasswordResetToken = (email, setEmailSent) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading....")
    dispatch(setLoading(true))
    try {
      console.log("object")
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email })

      console.log("RESET PASSWORD TOKEN  RESPONSE...................", response)
      if (!response.data.success) {
        throw new Error(response.data.message)

      }
      toast.success("Password Reset Link Sent Successfully")
      setEmailSent(true)
      // navigate("/verify-email")

    } catch (error) {
      console.log("Password Reste Token Error....................", error)
      toast.error("Reset Password LINK Failed")

    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export const resetPassword = (newPassword, confirmNewPassword, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      console.log({newPassword})
      console.log({confirmNewPassword})
      console.log("....................................")
      const response = await apiConnector("POST", RESETPASSWORD_API, { password:newPassword, confirmPassword:confirmNewPassword, token })
      console.log(response)
      console.log(response.data)
      console.log(response.data.data)
      console.log("RESET PASSWORD RESPONSE...........................", response.data)

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")



    } catch (error) {
      console.log("RESET PASSWORD FAILED ...........................", error.message)
      toast.error("RESET PASSWORD FAILED")

    }
    setLoading(false)
    toast.dismiss(toastId)
  }
}
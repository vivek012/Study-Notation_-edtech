
import Template from '../components/core/Auth/Template'
import loginImg from '../assets/Images/login.webp'

const Login = () => {
  return (
    <Template 
    title={"Welcome Back"}
    description1={"Build Skills for Today, tomorrow, and Beyond."}
    description2={"Education to future-proof your career"}
    image={loginImg}
    formType={"login"}
    />
  )
}

export default Login

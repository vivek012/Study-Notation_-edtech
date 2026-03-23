import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-full-Light.png"
import { Link, matchPath, useLocation } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'
import { useSelector } from 'react-redux'
import { IoCartOutline } from "react-icons/io5";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/api'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";






const Navbar = () => {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const {totalItems} = useSelector((state) => state.cart)

    const location = useLocation()

    const [sublinks, setSublinks] = useState([])

   

    useEffect(() => {
    
         const  fetchSublinks = async()=>{
            try {
                const result = await apiConnector("GET" , categories.CATEGORIES_API)
                console.log(result)
                setSublinks(result.data.data)
            } catch (error) {
                console.log("Cannot Fetch category")
                console.log(error.message)
            }
        }

        fetchSublinks(); 
    }, [])






    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname);
    }

    return (
        <div className='flex h-14 items-center justify-center border-b-2 border-richblack-700'>
            <div className="w-11/12 flex items-center max-w-maxContent justify-between">
                {/* logo */}
                <Link to={"/"}>
                    <img width={160} height={42} src={logo} alt="logo" loading='lazy' />

                </Link>
                {/* nav Link  */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, i) => {
                                return (
                                    <li className="" key={i}>
                                        {
                                            link.title === 'Catalog' ? (
                                                <div className="relative flex items-center gap-1 group">
                                                    <p className="">{link.title}</p> 
                                               <MdOutlineKeyboardArrowDown />

                                               <div className="invisible absolute  z-1000 left-[50%] right-[50%] translate-x-[-50%]
                                               translate-y-4 
                                               top-full pointer-events-auto flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible  group-hover:opacity-100 w-75 ">
                                                <div className="absolute left-[50%]  -top-2 -translate-x-1/2 h-6 w-6 rotate-45 rounded bg-richblack-5 "></div>
                                                {
                                                    sublinks.length > 0 ? (
                                                        sublinks.map((sublink, i)=>(
                                                        <Link to={`/Catalog/${sublink.name
                                                        .split(" ")
                                                        .join("-")
                                                        .toLowerCase()}`} key={i}>
                                                            <div className="rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50" >{sublink.name}</div>

                                                        </Link>
                                                    ))
                                                    ) :(
                                                        <div className="text-center">No Courses Found</div>
                                                    )
                                                }
                                               </div>
 
                                                </div>
                                            ) : (
                                                <Link to={link?.path}>
                                                    <p className={`${matchRoute(link?.path)? "text-yellow-25 ":"text-richblack-25"}`}>

                                                        {link.title}
                                                    </p>
                                                </Link>
                                            )
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>

                {/* login/signup button  */}
                <div className=" hidden items-center gap-x-4 md:flex">

                        {
                            user && user?.accountType !== "Instructor" && (
                                <Link to={"/dashboard/cart"} className='relative'>
                                    <IoCartOutline className='text-2xl text-richblack-100' />
                                    {
                                        totalItems > 0 && (
                                            <span className='absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                                {totalItems}
                                            </span>
                                        )
                                    }
                                </Link>
                            )
                        }
                        {
                            !token  && (
                                <Link to={"/login"}>
                                 <button className='rounded-md border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100'>Log In</button>
                                </Link>
                            )
                        }
                        {
                            !token  && (
                                <Link to={"/signup"}>
                                <button className=" bg-richblack-800  rounded-md border border-richblack-700 px-4 py-2 text-richblack-100">Sign Up</button>
                                </Link>
                            )
                        }
                        {
                            token !== null && <ProfileDropDown/>
                        }
                </div>


            </div>
        </div>
    )
}


export default Navbar

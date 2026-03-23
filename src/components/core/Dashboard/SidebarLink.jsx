import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux'
import { matchPath, NavLink, useLocation } from 'react-router-dom'



const SidebarLink = ({link , iconName}) => {

    const Icon = Icons[iconName]
    const location = useLocation()
    const dispatch = useDispatch(); 
    
    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname)
    }

return (
  <div>
    <NavLink
      to={link.path}
      className={`relative flex w-full  px-4 py-2 text-sm font-medium transition-all duration-200
      ${matchRoute(link.path)
        ? "bg-yellow-700 text-yellow-50"
        : "bg-opacity-0 text-richblack-300"}`}
    >
      
      <span
        className={`${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } absolute top-0 left-0 h-full w-[0.15rem] bg-yellow-50`}
      ></span>

      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>

    </NavLink>
  </div>
)
}

export default SidebarLink

{/* <NavLink
  to={link.path}
  className={`relative flex w-full px-4 py-2 text-sm font-medium transition-all duration-200
  ${
    matchRoute(link.path)
      ? "bg-yellow-700 text-yellow-50"
      : "bg-opacity-0 text-richblack-300"
  }`}
>
  <span
    className={`${
      matchRoute(link.path) ? "opacity-100" : "opacity-0"
    } absolute top-0 left-0 h-full w-[0.15rem] bg-yellow-50`}
  ></span>

  <div className="flex items-center gap-x-2">
    <Icon className="text-lg" />
    <span>{link.name}</span>
  </div>
</NavLink> */}
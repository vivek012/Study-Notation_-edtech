import React from 'react'

const IconButton = ({
    text,
    onclick,
    children,
    disabled,
    outline= false,
    customClasses,
    type
}) => {
  return (
    <button
    type={type}
    disabled={disabled}
    onClick={onclick}
    className={`flex items-center ${
          outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}>
        {children? (
            <>
            
            <span className='0'>{text}</span>
            {children}
            </>
        ): {text}}
    </button>
  )
}

export default IconButton

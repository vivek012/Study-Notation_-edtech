import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div>
        We  are Passinate about revolutionzing the way we learn. Our innovative platform 
        <HighlightText text={"combines technology"}/>
        <span className='bg-linear-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
            {" "}
            expertise
        </span>
         , and community to create an
         <span className="bg-linear-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
             {" "}
            unparalleled educational
        experience.
         </span>
    </div>
  )
}

export default Quote

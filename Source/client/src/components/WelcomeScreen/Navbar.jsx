import React from 'react'
import { useState } from 'react'
const Navbar = () => {
  const [isOpen,setIsOpen] = useState(false)
  return (
    <>
      <nav className='bg-white sticky'>
          <div className='h-20 items-center flex justify-between'>

            <div>
              <img src="/main-logo.png" alt="contracthubpk logo" className='h-70 w-70 px-20' />
            </div>
          {/* desktop button */}
            <div className='hidden sm:block'>
              <button>login</button>
              <button style={{padding:"50px"}}>register</button>
            </div>

            <button className="block sm:hidden"onClick={()=>setIsOpen(!isOpen)}>☰</button>

          </div>
          {/* button mobile */}
          <div className={`${isOpen?"block":"hidden"} sm:hidden`}>
              <button style={{padding:"10px",display:"block",alignItems:"center",marginLeft:"5px",color:"#153358",width:"95vw"}}>login</button>
              <button style={{padding:"10px",display:"block",alignItems:"center",marginLeft:"5px",backgroundColor:"#153358",color:"white",width:"95vw"}}>register</button>
            </div>
      </nav>
    </>
  )
}

export default Navbar

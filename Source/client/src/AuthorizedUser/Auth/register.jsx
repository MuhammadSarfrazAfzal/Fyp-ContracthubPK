import React from 'react'

const Register = () => {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gray-200'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-md'>
           <div style={{height:"50px",width:"250px",marginLeft:"100px",marginTop:"15px"}}><img src="/main-logo.png" alt="logo"style={{zIndex:"revert",position:"relative",top:"0px"}} /></div>
          <h1 className="text-2xl font-bold text-center py-10 text-blue-950">
            Register
          </h1>
          <form action="">
            {/* username */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
              <label className="block mb-1 font-medium text-blue-950">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full border h-10 m-2 border-blue-950 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:#153358"
              />
            </div>

            {/* Email */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px",paddingTop:"10px" }}>
              <label className="block mb-1 font-medium text-blue-950">User Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border h-10 m-2 border-blue-950 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:#153358"
              />
            </div>

            {/* Password */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px",paddingTop:"10px" }}>
              <label className="block mb-1 font-medium text-blue-950">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border h-10 m-2 border-blue-950 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:#153358" />
            </div>

            {/* Role Selection */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px",paddingTop:"10px" }}>
              <label className="block mb-2 font-medium text-blue-950">Select Role</label>

              <div className="flex gap-4">

                <label className="flex items-center gap-2 text-blue-950">
                  <input type="radio" name="role" value="admin" />
                  Admin
                </label>

                <label className="flex items-center gap-2 text-blue-950">
                  <input type="radio" name="role" value="freelancer" />
                  Freelancer
                </label>

                <label className="flex items-center gap-2 text-blue-950">
                  <input type="radio" name="role" value="client" />
                  Client
                </label>

              </div>
            </div>

            {/* Login Text */}
            <p className="text-sm text-center">
              If you already have an account then{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Login
              </span>
            </p>

            {/* Register Button */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px",paddingTop:"10px",paddingBottom:"10px" }}>
              <button
                type="submit"
                className="w-full h-10 bg-blue-900 text-white rounded hover:bg-blue-950 transition"
              >
                Register
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Register

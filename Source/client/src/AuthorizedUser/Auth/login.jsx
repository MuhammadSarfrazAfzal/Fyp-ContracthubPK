import React from 'react'

const Login = () => {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gray-200'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-md'>
           <div style={{height:"50px",width:"250px",marginLeft:"100px",marginTop:"15px"}}><img src="/main-logo.png" alt="logo"style={{zIndex:"revert",position:"relative",top:"0px"}} /></div>
          <h1 className="text-2xl font-bold text-center py-10 text-blue-950">
            login
          </h1>
          <form action="">
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

            {/* Register Text */}
            <p className="text-sm text-center">
              If you already have an account then{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Register
              </span>
            </p>

            {/* Register Button */}
            <div style={{ paddingLeft: "15px", paddingRight: "15px",paddingTop:"10px",paddingBottom:"10px" }}>
              <button
                type="submit"
                className="w-full h-10 bg-blue-900 text-white rounded hover:bg-blue-950 transition"
              >
                Login
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Login

import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
import Login from './AuthorizedUser/Auth/login'
import Register from './AuthorizedUser/Auth/register'
function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<WelcomeScreen/>} />
      <Route path="/register" element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </>
  )
}

export default App

import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<WelcomeScreen/>} />
      
    </Routes>
    </>
  )
}

export default App

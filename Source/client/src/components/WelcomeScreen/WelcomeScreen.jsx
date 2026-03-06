import React from 'react'
import NavBar from '../NavBar/NavBar'
import '../WelcomeScreen/WelcomeScreen.css'
import Navbar from './Navbar'
const WelcomeScreen = () => {

  return (
    <>
      <Navbar></Navbar>
      <div className="wrapper">
        <main className="hero">
          <div className="hero-text">
            <span className="tag">FREELANCE CONTRACT MANAGEMENT SOFTWARE</span>
            <h1 className='w-full text-2xl sm:text-4xl font-bold whitespace-normal wrap-break-word'>
              Streamline your entire contract lifecycle in one platform...
            </h1>
            <p>
              Draft, collaborate, approve, and sign contracts without switching
              tools reduce risk and close faster.
            </p>


            <div className="buttons">
              <button className="primary">Request a demo</button>
              <button className="secondary">Start free 14-day trial</button>
            </div>
            <span className="subtext">No credit card required</span>


            <div className="trust">
              <div className="badge">Leader<br />Fall 2023</div>
              <div className="badge">Best Results<br />Fall 2023</div>
              <div className="reviews">
                <strong>★★★★☆ 4.7</strong><br />
                2,960+ total reviews
              </div>
            </div>
          </div>


          <div className="hero-visual hidden sm:block">
            <div className="doc back"></div>
            <div className="doc front">
              <div className="doc-title">BUSINESS<br />CONTRACT</div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default WelcomeScreen

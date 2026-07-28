import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/pages/Header'
import Footer from './components/pages/Footer'

function App() {
  const location = useLocation()

  const isUserPage = location.pathname.includes('user') === true
  const isComparePage = location.pathname.includes('compare') === true
  
  const searchRef = useRef(null)
  return (
    <>
      <Header isUserPage={isUserPage} isComparePage={isComparePage} />
      <Outlet context={searchRef} />
      <Footer searchRef={searchRef} />
    </>
  )
}

export default App

import React, { useEffect, useRef, useState } from 'react'
import stackRead from '../../assets/svgs/header-svgs/stackread.svg'
import { Scale, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import DotField from '../../assets/animations/DotField'
import { SiGithub } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'

export default function Header({ isUserPage, isComparePage }) {
  const [isSticky, setIsSticky] = useState(true)

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const lastScrollY = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
        setIsSticky(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsSticky(true)
      }
      if (currentScrollY === 0) setIsSticky(true)
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`${isSticky ? 'sticky top-2 z-50' : 'relative'} w-full left-0 mt-2`}
    >
      <div className="relative z-999 flex justify-between items-center w-[90%] mx-auto py-3 px-2 lg:px-6 bg-bg/90 backdrop-blur-[0.5px] supports-backdrop-filter:bg-bg/75 shadow-[0_8px_32px_#6365f12e] transition-all duration-600">
        <span className="absolute inset-0 border border-dashed border-bg-secondary/60"></span>
        <div
          onClick={() => {
            navigate('/')
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="flex justify-center items-center gap-2"
        >
          <img
            className="w-4 lg:w-7 h-4 lg:h-7"
            src={stackRead}
            alt="Stack Read"
          />
          <div className="font-logo font-bold text-text-primary text-md lg:text-3xl ">
            StackRead
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 lg:gap-6">
          <div className="flex justify-center items-center gap-2 lg:gap-4">
            {isUserPage ? (
              <motion.span
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  navigate('/')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="relative px-1.5 font-heading text-[12px] lg:text-[20px] transition-transform duration-200 tracking-widest text-text-primary cursor-pointer hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300"
              >
                <span className="absolute inset-0 border border-dashed border-bg-secondary/60 bg-bg-secondary/5 group-hover:bg-bg-secondary/10"></span>
                <span className="flex justify-center items-center gap-2 py-0.75 px-1">
                  <Search
                    strokeWidth={1}
                    size={isDesktop ? 20 : 12}
                    className="transition-transform duration-200 group-hover:rotate-45"
                  />
                  Search User
                </span>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -right-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -bottom-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -right-0.5 -bottom-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
              </motion.span>
            ) : (
              ''
            )}
            {isComparePage ? (
              <motion.span
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  navigate('/')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="relative px-1.5 font-heading text-[12px] lg:text-[20px] transition-transform duration-200 tracking-widest text-text-primary cursor-pointer hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300"
              >
                <span className="absolute inset-0 border border-dashed border-bg-secondary/60 bg-bg-secondary/5 group-hover:bg-bg-secondary/10"></span>
                <span className="flex justify-center items-center gap-2 py-0.75 px-1">
                  <Search
                    strokeWidth={1}
                    size={isDesktop ? 20 : 12}
                    className="transition-transform duration-200 group-hover:rotate-45"
                  />
                  Search User
                </span>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -right-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -bottom-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -right-0.5 -bottom-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
              </motion.span>
            ) : (
              <motion.span
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  navigate('/compare')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className={`relative px-1.5 font-heading text-[12px] lg:text-[20px] transition-transform duration-200 tracking-widest text-text-primary cursor-pointer hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300 ${isUserPage ? 'hidden lg:flex' : ''}`}
              >
                <span className="absolute inset-0 border border-dashed border-bg-secondary/60 bg-bg-secondary/5 group-hover:bg-bg-secondary/10"></span>
                <span className="flex justify-center items-center gap-2 py-0.75 px-1">
                  <Scale
                    strokeWidth={1}
                    size={isDesktop ? 20 : 12}
                    className="transition-transform duration-200 group-hover:rotate-45"
                  />
                  Compare Profiles
                </span>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -top-0.5 -right-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -bottom-0.5 -left-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  className="absolute -right-0.5 -bottom-0.5 fill-bg-secondary transition-transform duration-200 group-hover:rotate-45"
                >
                  <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                </svg>
              </motion.span>
            )}
          </div>
          <SiGithub
            onClick={() =>
              window.open('https://www.github.com/imthatrehan/', '_blank')
            }
            size={isDesktop ? 34 : 18}
            className="hover:text-text-secondary cursor-pointer relative z-50"
          />
        </div>
        <svg
          width="5"
          height="5"
          viewBox="0 0 5 5"
          className="absolute -top-0.5 -left-0.5 fill-bg-secondary"
        >
          <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
        </svg>
        <svg
          width="5"
          height="5"
          viewBox="0 0 5 5"
          className="absolute -top-0.5 -right-0.5 fill-bg-secondary"
        >
          <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
        </svg>
        <svg
          width="5"
          height="5"
          viewBox="0 0 5 5"
          className="absolute -bottom-0.5 -left-0.5 fill-bg-secondary"
        >
          <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
        </svg>
        <svg
          width="5"
          height="5"
          viewBox="0 0 5 5"
          className="absolute -right-0.5 -bottom-0.5 fill-bg-secondary"
        >
          <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
        </svg>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import DotField from '../../assets/animations/DotField'
import { Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSeaction() {
  const { searchRef } = useOutletContext()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/user/${query.trim()}`)
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <div className="flex justify-center items-center w-full relative z-0 p-10 lg:p-28">
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <div className="flex justify-center items-center gap-1 lg:gap-2 text-bg-primary bg-bg-primary/15 border-[0.75px] border-bg-primary/40 px-2 lg:px-4 py-1.25 text-[12px] lg:text-md font-para rounded-full">
            <Sparkles strokeWidth={1.5} size={isDesktop ? 16 : 12} />
            Powered by GitHub API and Google Gemini
          </div>
          <div className="text-3xl lg:text-6xl font-heading text-text-primary font-bold text-center mt-2">
            Analyze any{' '}
            <span className="relative px-1.5 transition-transform duration-200 tracking-widest text-text-primary hover:[&_div]:top-0 hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300">
              <span className="absolute inset-0 border border-dashed border-bg-secondary/60 bg-bg-secondary/5 group-hover:bg-bg-secondary/10"></span>
              <div className="absolute top-20 inset-0 bg-bg-secondary/15 group-hover:bg-bg-secondary/10 transition-all duration-200"></div>
              <span className="py-0.75 px-1">GitHub</span>
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
            </span>
            <br />
            profile instantly
          </div>
          <div className="text-lg lg:text-2xl font-para text-text-secondary font-extralight text-center w-[80%] mx-auto">
            AI-powered insights, scores, and improvement suggestions for any
            GitHub user.
          </div>
          <div className="flex justify-center items-center gap-4 w-full mt-4">
            <span className="relative px-1.5 w-full transition-transform duration-200 tracking-widest text-text-primary hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300">
              <span className="absolute inset-0 -z-1 border border-dashed border-bg-secondary/60 bg-bg-secondary/20 group-hover:bg-bg-secondary/10"></span>
              <input
                type="search"
                name="search"
                id="search"
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="outline-none w-full text-text-primary placeholder:text-text-primary/60 text-sm tracking-tight lg:tracking-normal lg:text-xl font-medium font-heading pl-1 lg:pl-6 py-2"
                placeholder="Enter GitHub username ..."
              />
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
            </span>
            <span className="relative px-1.5 transition-transform duration-200 tracking-widest hover:[&_button]:text-text-primary cursor-pointer hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300">
              <span className="absolute inset-0 -z-1 border border-dashed border-bg-secondary/60 bg-bg-secondary/20 group-hover:bg-bg-secondary/10"></span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                onClick={handleSearch}
                className="flex justify-center items-center gap-2 text-text-secondary text-sm lg:text-xl font-heading py-2 cursor-pointer"
              >
                <Search strokeWidth={1.5} size={20} />
                Analyze
              </motion.button>
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
            </span>
          </div>
        </div>
      </div>
      <div
        className="border-dashed border-b-[0.5px] border-text-secondary/30 h-120 lg:h-screen overflow-hidden"
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <DotField
          dotRadius={1.2}
          dotSpacing={9}
          bulgeStrength={16}
          glowRadius={150}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={350}
          cursorForce={3.33}
          bulgeOnly={true}
          gradientFrom="#A855F7"
          gradientTo="#C084FC"
          glowColor="rgba(168, 85, 247, 0.15)"
        />
      </div>
    </>
  )
}

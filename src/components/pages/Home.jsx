import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HeroSeaction from '../home-components/HeroSeaction'
import HangingIdCard from '../../assets/animations/HangingIdCard'
import {
  Astroid,
  BrushCleaning,
  History,
  Info,
  MoveRight,
  Search,
  Trophy,
  X,
  Zap,
} from 'lucide-react'

export default function Home() {
  const { searchRef } = useOutletContext()
  const [usersData, setUsersData] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [topProfiles, setTopProfiles] = useState([])

  const [loadingRecent, setLoadingRecent] = useState(true)
  const [loadingTop, setLoadingTop] = useState(true)

  const navigate = useNavigate()

  const topprofiles = [
    'torvalds',
    'gaearon',
    'sindresorhus',
    'yyx990803',
    'tj',
    'kentcdodds',
  ]

  useEffect(() => {
    setLoadingTop(true)
    Promise.all(
      topprofiles.map((username) =>
        fetch(`https://api.github.com/users/${username}`).then((res) =>
          res.json(),
        ),
      ),
    ).then((data) => {
      setTopProfiles(data)
      setLoadingTop(false)
    })
  }, [])

  useEffect(() => {
    setLoadingRecent(true)
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const validStored = stored
      .filter(
        (username) =>
          username &&
          typeof username === 'string' &&
          username.trim().length > 0 &&
          !/[\s]/.test(username),
      )
      .slice(0, 5)

    setRecentSearches(validStored)

    if (validStored.length > 0) {
      Promise.allSettled(
        validStored.map((username) =>
          fetch(`https://api.github.com/users/${username}`).then((res) =>
            res.ok ? res.json() : null,
          ),
        ),
      ).then((results) => {
        const validData = results
          .filter(
            (result) => result.status === 'fulfilled' && result.value !== null,
          )
          .map((result) => result.value)
        setUsersData(validData)
        setLoadingRecent(false)
      })
    } else {
      setLoadingRecent(false)
    }
  }, [])

  const clearAllSearches = () => {
    localStorage.removeItem('recentSearches')
    setRecentSearches([])
    setUsersData([])
  }

  const removeSearch = (username) => {
    const updated = recentSearches.filter((u) => u !== username)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    setRecentSearches(updated)
    setUsersData(usersData.filter((u) => u.login !== username))
  }

  return (
    <>
      <HeroSeaction />
      <div className="w-full mt-16 lg:mt-22 py-8 lg:py-29 px-4 lg:px-8">
        <div className="flex flex-col mb-20">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2 text-text-secondary font-heading font-semibold text-2xl hover:[&_svg]:rotate-360">
              <History className="transition-transform duration-200" />
              Recent Searches
            </div>
            <div
              className="flex justify-between items-center gap-1 text-text-secondary hover:text-danger font-heading font-semibold text-md cursor-pointer"
              onClick={clearAllSearches}
            >
              <BrushCleaning
                size={16}
                className="transition-transform duration-200"
              />
              Clear All
            </div>
          </div>

          {loadingRecent ? (
            <div className="flex justify-start items-center gap-4 mt-8 px-4 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-bg-primary/20 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          ) : usersData.length > 0 ? (
            <div className="flex justify-start items-center gap-4 mt-8 px-4 flex-wrap">
              {usersData.slice(0, 5).map((user) => {
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      navigate(`/user/${user.login}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="flex justify-center items-center gap-1.5 px-3 py-1.75 text-lg font-para font-semibold text-text-secondary bg-bg-primary/15 rounded-full hover:[&_svg]:block hover:[&_img]:hidden hover:[&_p]:underline cursor-pointer relative group"
                  >
                    <X
                      className="w-7 h-7 hidden group-hover:block text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeSearch(user.login)
                      }}
                    />
                    <img
                      className="w-7 h-7 rounded-full block group-hover:hidden"
                      src={user.avatar_url}
                      alt=""
                    />
                    <p>{user.login}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-8 px-4 text-text-secondary/60 font-para">
              No recent searches yet.
            </p>
          )}
        </div>
        <div className="flex flex-col mt-10">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2 text-text-secondary font-heading font-semibold text-2xl hover:[&_svg]:fill-text-secondary">
              <Trophy className="transition-transform duration-200" />
              Try these profiles
            </div>
          </div>

          <div className="flex justify-start flex-wrap items-center gap-6 lg:gap-4 px-2 lg:px-0 mt-8">
            {loadingTop
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="relative flex justify-start items-center gap-4 w-98 h-30 px-6 py-4 border border-dashed border-bg-primary/60 bg-bg-primary/10 animate-pulse"
                  >
                    <div className="w-16 h-16 rounded-full bg-bg-primary/20"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-32 h-6 bg-bg-primary/20 rounded-md"></div>
                      <div className="w-24 h-4 bg-bg-primary/20 rounded-md"></div>
                      <div className="w-40 h-4 bg-bg-primary/20 rounded-md"></div>
                    </div>
                    <div className="absolute bottom-5 right-5 w-8 h-8 bg-bg-primary/20"></div>
                  </div>
                ))
              : topProfiles.slice(0, 6).map((user) => {
                  return (
                    <span
                      key={user.id}
                      onClick={() => {
                        navigate(`/user/${user.login}`)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="relative flex justify-start items-center gap-4 w-98 h-30 px-6 py-4 text-lg font-para font-semibold text-text-secondary hover:[&_svg]:blhock hover:[&_img]:hidhden hover:[&_.a]:translate-x-6 hover:[&_.a]:opacity-0 hover:[&_.b]:translate-x-0 hover:[&_.b]:opacity-100 hover:[&_.id]:underline cursor-pointer"
                    >
                      <span className="absolute inset-0 border border-dashed border-bg-primary/60 bg-bg-primary/10 group-hover:bg-bg-primary/10"></span>
                      <img
                        className="w-16 h-16 rounded-full block"
                        src={user.avatar_url}
                        alt=""
                      />
                      <div className="flex justify-center items-start flex-col">
                        <p className="text-3xl text-text-primary font-heading font-bold">
                          {user.name}
                        </p>
                        <p className="text-sm font-medium ml-2 id -mt-0.75">
                          @{user.login}
                        </p>
                        <p className="text-[16px] text-text-primary/80 font-light">
                          {user.company || user.blog}
                        </p>
                      </div>
                      <div className="absolute bottom-5 right-5">
                        <span className="relative transition-transform duration-200 tracking-widest text-text-primary hover:[&_div]:top-0 hover:[&>svg:not(:first-child)]:rotate-45 [&>svg]:transition-transform [&>svg]:duration-300">
                          <span className="absolute inset-0 border border-dashed border-bg-secondary/60 bg-bg/90 group-hover:bg-bg/10"></span>
                          <div className="absolute top-20 inset-0 bg-bg-secondary/15 group-hover:bg-bg-secondary/10 transition-all duration-200"></div>
                          <div className="w-8 h-8 overflow-hidden flex justify-center items-center">
                            <MoveRight className="w-4 h-4 absolute a transition-all duration-200 opacity-100" />
                            <MoveRight className="w-4 h-4 absolute -translate-x-6 b transition-all duration-200 opacity-0" />
                          </div>
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
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="absolute -top-0.5 -left-0.5 fill-bg-primary transition-transform duration-200 group-hover:rotate-45"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="absolute -top-0.5 -right-0.5 fill-bg-primary transition-transform duration-200 group-hover:rotate-45"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="absolute -bottom-0.5 -left-0.5 fill-bg-primary transition-transform duration-200 group-hover:rotate-45"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="absolute -right-0.5 -bottom-0.5 fill-bg-primary transition-transform duration-200 group-hover:rotate-45"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                    </span>
                  )
                })}
          </div>
        </div>
      </div>
      <div className="w-full mt-12 px-8 mx-auto">
        <div className="flex flex-col mt-10">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2 text-text-secondary font-heading font-semibold text-2xl">
              <Info className="transition-transform duration-200" />
              How it works
            </div>
          </div>
        </div>
        <div className="flex justify-between flex-wrap items-center gap-y-10 mx-auto lg:px-20 py-8 mb-14 w-full ">
          <HangingIdCard
            accentColor="#173eff"
            ropeLength={140}
            cardNumber={1}
            icon={<Search className="w-7 h-7 text-bg" />}
            title="Enter username"
            info="Type any public GitHub username in the search bar above."
          />
          <HangingIdCard
            accentColor="#173eff"
            ropeLength={140}
            cardNumber={2}
            icon={<Zap className="w-7 h-7 text-bg" />}
            title="Instant analysis"
            info="We fetch real-time data from the GitHub REST API including repos, stars, and activity"
          />
          <HangingIdCard
            accentColor="#173eff"
            ropeLength={140}
            cardNumber={3}
            icon={<Astroid className="w-7 h-7 text-bg" />}
            title="AI suggestions"
            info="Google Gemini analyzes the profile and generates a score, strengths, and improvement tips."
          />
        </div>
      </div>
    </>
  )
}

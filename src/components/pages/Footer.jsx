import React, { useEffect, useState } from 'react'
import stackRead from '../../assets/svgs/header-svgs/stackread.svg'
import DotGrid from '../../assets/animations/DotGrid'
import ShinyText from '../../assets/animations/ShinyText'
import SpecularButton from '../../assets/animations/SpecularButton'
import { Mail, MoveRight, Phone } from 'lucide-react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { SiFacebook, SiInstagram, SiTiktok, SiX } from 'react-icons/si'
import StackRead from '../../assets/animations/StackRead'

export default function Footer({ searchRef }) {
  const navigate = useNavigate()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div className="relative w-full h-[80vh] overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 ignore-for-screenshot">
          <DotGrid
            dotSize={2}
            gap={10}
            baseColor="#2F293A"
            activeColor="#5227FF"
            proximity={80}
            shockRadius={250}
            shockStrength={2}
            resistance={1800}
            returnDuration={4.7}
          />
        </div>
        <div className="relative z-10 px-5 w-full h-full flex flex-col lg:flex-row justify-center items-center">
          <div className="text-start flex flex-col items-start justify-center max-w-200 h-full my-auto">
            <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Your GitHub profile deserves to shine{' '}
              <span className="pr-2">
                <ShinyText
                  text="now"
                  speed={2}
                  delay={0}
                  color="#A855F7"
                  shineColor="#6366F1"
                  spread={25}
                  direction="left"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
              </span>
              .
            </h2>

            <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-146 leading-relaxed font-medium">
              Get instant AI-driven insights, track your open-source journey,
              and build a GitHub presence that stands out. Analyze once, grow
              forever.
            </p>
          </div>
          <div className="flex justify-center items-center lg:items-end gap-4 mb-13 lg:mb-0 lg:mt-50">
            <SpecularButton
              size={isDesktop ? 'lg' : 'md'}
              radius={18}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#f5f5f5"
              lineColor="#ffffff"
              baseColor="#525252"
              intensity={1}
              shineSize={10}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={() => {
                if (window.location.pathname.includes('/user/')) {
                  window.scrollTo({ top, behavior: 'smooth' })
                  if (searchRef.current) {
                    searchRef.current.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                } else {
                  navigate('/')
                  window.scrollTo({ top, behavior: 'smooth' })
                }
              }}
              className=""
            >
              Search User
            </SpecularButton>
            <button
              onClick={() => {
                if (window.location.pathname.includes('/compare')) {
                  window.scrollTo({ top, behavior: 'smooth' })
                } else {
                  navigate('/compare')
                  window.scrollTo({ top, behavior: 'smooth' })
                }
              }}
              className="bg-bg/95 flex justify-center items-center gap-2 border-[1.5px] hover:[&_svg]:translate-x-1 cursor-pointer border-gray-400/20 rounded-2xl lg:rounded-[18px] text-[0.9rem] lg:text-[16px] w-38 h-11 lg:w-42 lg:h-13.5 font-medium leading-none tracking-[0.01em] text-text-primary"
            >
              Compare Users <MoveRight size={isDesktop ? 24 : 16} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-bg flex flex-col w-full relative lg:min-h-[63vh] overflow-hidden">
        <div className="flex justify-evenly flex-row items-center px-6 py-8 relative z-10">
          <div className="flex flex-col justify-center items-center gap-y-3">
            <div className="flex justify-center items-center gap-2 font-logo font-bold text-text-primary text-3xl mb-2">
              <img className="w-8 h-8" src={stackRead} alt="Stack Read" />
              StackRead
            </div>
            <p className="text-text-primary font-para font-semibold text-[18px] -mt-3">
              Make your profile professional
            </p>
            <div className="flex justify-center items-center gap-6 mt-2">
              <SiInstagram
                onClick={() =>
                  window.open(
                    'https://www.instagram.com/versebyrehan/',
                    '_blank',
                  )
                }
                className="text-[22px] text-primary hover:text-primary/60 cursor-pointer"
              />
              <SiFacebook
                onClick={() =>
                  window.open('https://www.facebook.com/imthatrehan/', '_blank')
                }
                className="text-[22px] text-primary hover:text-primary/60 cursor-pointer"
              />
              <SiTiktok
                onClick={() =>
                  window.open('https://www.tiktok.com/@imthatrehan/', '_blank')
                }
                className="text-[22px] text-primary hover:text-primary/60 cursor-pointer"
              />
              <SiX
                onClick={() =>
                  window.open('https://x.com/imthatrehan/', '_blank')
                }
                className="text-[22px] text-primary hover:text-primary/60 cursor-pointer"
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-col justify-center items-center gap-y-3">
            <h1 className="text-text-primary font-heading font-bold text-[18px]">
              Quick Links
            </h1>
            <div className="flex flex-col justify-start items-start gap-y-2">
              <p
                onClick={() => {
                  navigate('/')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Home
              </p>
              <p
                onClick={() => {
                  navigate('/user/imthatrehan')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Profiles
              </p>
              <p
                onClick={() => {
                  navigate('/compare')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Compare
              </p>
              <p
                onClick={() => {
                  navigate('/about')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                About
              </p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col justify-center items-center gap-y-3">
            <h1 className="text-text-light dark:text-text-dark font-para font-bold text-[18px]">
              Contact
            </h1>
            <div className="flex flex-col justify-start items-start gap-y-2">
              <div className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline">
                <div className="flex justify-center items-center gap-2">
                  <Mail size={14} />
                  <Link to="mailto:support@stackread.com">
                    support@stackread.com
                  </Link>
                </div>
              </div>
              <div className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline">
                <div className="flex justify-center items-center gap-2">
                  <Phone size={14} />
                  <Link to="mailto:+1 800 ZAP BAY">+1 800 STACK READ</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center mb-6">
          <div className="lg:hidden flex flex-col justify-center items-center gap-y-3">
            <h1 className="text-text-primary font-heading font-bold text-[18px]">
              Quick Links
            </h1>
            <div className="flex flex-col justify-start items-start gap-y-2">
              <p
                onClick={() => {
                  navigate('/')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Home
              </p>
              <p
                onClick={() => {
                  navigate('/user/imthatrehan')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Profiles
              </p>
              <p
                onClick={() => {
                  navigate('/compare')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                Compare
              </p>
              <p
                onClick={() => {
                  navigate('/about')
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline"
              >
                About
              </p>
            </div>
          </div>
          <div className="lg:hidden flex flex-col justify-center items-center gap-y-3">
            <h1 className="text-text-light dark:text-text-dark font-para font-bold text-[18px]">
              Contact
            </h1>
            <div className="flex flex-col justify-start items-start gap-y-2">
              <div className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline">
                <div className="flex justify-center items-center gap-2">
                  <Mail size={14} />
                  <Link to="mailto:support@stackread.com">
                    support@stackread.com
                  </Link>
                </div>
              </div>
              <div className="text-text-secondary font-para font-semibold text-[16px] text-start cursor-pointer hover:underline">
                <div className="flex justify-center items-center gap-2">
                  <Phone size={14} />
                  <Link to="mailto:+1 800 ZAP BAY">+1 800 STACK READ</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-2 border-t-gray-800 border-t relative z-10 bg-bg">
          <span className="text-gray-500 dark:text-text-dark/80 text-[11px] lg:text-[14px] text-start font-para lg:pl-6">
            © 2025 stackread. All rights reserved.
          </span>
          <div className="flex justify-center items-center gap-4 lg:pr-6 text-[13px] lg:text-[16px]">
            <span
              onClick={() => {
                navigate('/privacy-policy')
                window.scrollTo({ top, behavior: 'smooth' })
              }}
              className="text-gray-500 dark:text-text-dark/80 font-para cursor-pointer hover:underline"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => {
                navigate('/terms')
                window.scrollTo({ top, behavior: 'smooth' })
              }}
              className="text-gray-500 dark:text-text-dark/80 font-para cursor-pointer hover:underline"
            >
              Terms
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 translate-y-4 left-0 w-full z-0 hidden lg:flex justify-center items-end pointer-events-none">
          {/* <StackRead /> */}
          <div className="text-[245px] lg:text-[260px] font-heading font-extrabold tracking-tighter leading-[0.75] bg-linear-to-b from-transparent via-text-primary/40 to-text-primary/20 bg-clip-text text-transparent select-none pb-0">
            STACKREAD
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-bg-primary/90 via-bg/60 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </>
  )
}

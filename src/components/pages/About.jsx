import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Code, Zap, Shield, Globe, Brain } from 'lucide-react'
import { SiGithub, SiGoogle } from 'react-icons/si'

const CornerSvg = ({ color = 'fill-bg-secondary', position }) => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    className={`absolute ${position} ${color} transition-transform duration-300 group-hover:rotate-45`}
  >
    <path d="M2.5 0h1v2.5h2.5v1h-2.5V6h-1V3.5H0v-1h2.5z"></path>
  </svg>
)

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

export default function About() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      className="min-h-screen bg-bg px-4 lg:px-24 py-12 pb-20"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-text-secondary bg-bg-primary/5 px-4 py-2 rounded-full border border-dashed border-bg-primary/20 mb-4">
          <Sparkles size={14} className="text-bg-primary" /> About StackRead
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
          Bridging the Gap Between <span className="text-bg-primary">Code</span>{' '}
          and <span className="text-bg-secondary">Insight</span>
        </h1>
        <p className="text-text-secondary font-para text-lg max-w-2xl mx-auto mt-3">
          We are on a mission to empower every developer to understand and
          improve their open-source footprint using the power of AI.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-16">
        <motion.div
          variants={fadeVariants}
          className="bg-card p-10 rounded-3xl shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative group"
        >
          <CornerSvg position="-top-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-top-1 -right-1" color="fill-bg-secondary" />
          <CornerSvg position="-bottom-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-right-1 -bottom-1" color="fill-bg-secondary" />

          <h2 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-3 mb-4">
            <Zap className="text-bg-primary" size={28} /> Our Mission
          </h2>
          <p className="text-text-secondary font-para text-lg leading-relaxed">
            Your GitHub profile is your digital resume, but raw data doesn't
            tell the full story. StackRead was built to transform dull metrics
            into actionable intelligence. Whether you are a seasoned open-source
            maintainer or just starting your journey, we provide the clarity you
            need to level up your presence.
          </p>
        </motion.div>

        <motion.div
          variants={fadeVariants}
          className="bg-card p-10 rounded-3xl shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative group"
        >
          <CornerSvg position="-top-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-top-1 -right-1" color="fill-bg-secondary" />
          <CornerSvg position="-bottom-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-right-1 -bottom-1" color="fill-bg-secondary" />

          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-text-primary flex items-center gap-3 mb-6">
            <Code className="text-bg-primary" size={28} /> Powered by the Best
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg/60 p-6 rounded-2xl border border-dashed border-bg-secondary/20 text-center flex flex-col items-center gap-2">
              <SiGithub size={40} className="text-bg-primary mb-1" />
              <h4 className="font-heading font-bold text-text-primary">
                GitHub API
              </h4>
              <p className="text-text-secondary font-para text-sm">
                We fetch real-time, live data including your repositories,
                stars, forks, followers, and commit history directly from the
                GitHub REST API.
              </p>
            </div>
            <div className="bg-bg/60 p-6 rounded-2xl border border-dashed border-bg-secondary/20 text-center flex flex-col items-center gap-2">
              <Brain size={40} className="text-bg-secondary mb-1" />
              <h4 className="font-heading font-bold text-text-primary">
                Google Gemini 3.6
              </h4>
              <p className="text-text-secondary font-para text-sm">
                Our AI engine processes your profile data to generate a
                comprehensive score, identify strengths, and provide targeted
                suggestions for improvement.
              </p>
            </div>
            <div className="bg-bg/60 p-6 rounded-2xl border border-dashed border-bg-secondary/20 text-center flex flex-col items-center gap-2">
              <Globe size={40} className="text-warning mb-1" />
              <h4 className="font-heading font-bold text-text-primary">
                Modern Stack
              </h4>
              <p className="text-text-secondary font-para text-sm">
                Built with React, Vite, and Tailwind CSS. StackRead offers a
                lightning-fast, responsive, and elegant user experience on all
                devices.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeVariants}
          className="bg-card p-10 rounded-3xl shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative group"
        >
          <CornerSvg position="-top-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-top-1 -right-1" color="fill-bg-secondary" />
          <CornerSvg position="-bottom-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-right-1 -bottom-1" color="fill-bg-secondary" />

          <h2 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-3 mb-4">
            <Shield className="text-bg-primary" size={28} /> Why StackRead?
          </h2>
          <ul className="space-y-3 text-text-secondary font-para text-lg">
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-2 h-2 rounded-full bg-bg-primary shrink-0"></span>
              <span>
                <strong className="text-text-primary font-heading">
                  Comprehensive Scoring:
                </strong>{' '}
                Our unique algorithm evaluates your profile based on
                completeness, repository quality, community impact, and more.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-2 h-2 rounded-full bg-bg-primary shrink-0"></span>
              <span>
                <strong className="text-text-primary font-heading">
                  Actionable Feedback:
                </strong>{' '}
                We don't just give you a number. We tell you exactly where you
                can improve whether it's adding better repo descriptions or
                pinning your best work.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-2 h-2 rounded-full bg-bg-primary shrink-0"></span>
              <span>
                <strong className="text-text-primary font-heading">
                  Privacy First:
                </strong>{' '}
                We don't store your personal data. We simply analyze public
                GitHub data and give you insights instantly.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

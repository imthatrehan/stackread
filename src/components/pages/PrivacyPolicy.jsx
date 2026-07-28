import React from 'react'
import { motion } from 'framer-motion'
import { Shield, FileText, Lock, Mail } from 'lucide-react'

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

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      className="min-h-screen bg-bg px-4 lg:px-24 py-12 pb-20"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-text-secondary bg-bg-primary/5 px-4 py-2 rounded-full border border-dashed border-bg-primary/20 mb-4">
          <Lock size={14} className="text-bg-primary" /> Privacy Policy
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
          Your Data is <span className="text-bg-primary">Safe</span> with Us
        </h1>
        <p className="text-text-secondary font-para text-lg max-w-2xl mx-auto mt-3">
          Last updated: July 27, 2026. We value your privacy and are committed
          to protecting your personal information.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          variants={fadeVariants}
          className="bg-card p-10 rounded-3xl shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative group"
        >
          <CornerSvg position="-top-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-top-1 -right-1" color="fill-bg-secondary" />
          <CornerSvg position="-bottom-1 -left-1" color="fill-bg-secondary" />
          <CornerSvg position="-right-1 -bottom-1" color="fill-bg-secondary" />

          <div className="space-y-6 text-text-secondary font-para text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <FileText size={20} className="text-bg-primary" /> Information
                We Collect
              </h2>
              <p>
                StackRead only accesses <strong>publicly available data</strong>{' '}
                from the GitHub REST API. We do not ask for or store any
                sensitive personal information such as your password, private
                repositories, or email addresses.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Public GitHub profile details (name, bio, location, company,
                  website).
                </li>
                <li>
                  Public repository data (names, descriptions, star counts,
                  forks, languages).
                </li>
                <li>Public follower and following counts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <Shield size={20} className="text-bg-primary" /> How We Use Data
              </h2>
              <p>
                The data we fetch is used solely for the purpose of analyzing
                your GitHub presence and generating the AI-driven insights,
                score, and improvement suggestions displayed on your profile
                dashboard.
              </p>
              <p className="mt-2">
                We do not sell, trade, or rent your data to any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <Lock size={20} className="text-bg-primary" /> Data Storage &
                Retention
              </h2>
              <p>
                StackRead does not maintain a database of user profiles. We
                process your data in real-time during your active session and do
                not permanently store it. The only local storage used is in your
                browser to remember your <strong>"Recent Searches"</strong> for
                your convenience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <Mail size={20} className="text-bg-primary" /> Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="mt-2 font-mono font-medium text-bg-primary">
                support@stackread.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

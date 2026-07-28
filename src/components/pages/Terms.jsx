import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertCircle, Shield } from 'lucide-react'

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

export default function Terms() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      className="min-h-screen bg-bg px-4 lg:px-24 py-12 pb-20"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-text-secondary bg-bg-primary/5 px-4 py-2 rounded-full border border-dashed border-bg-primary/20 mb-4">
          <FileText size={14} className="text-bg-primary" /> Terms of Service
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
          We Play <span className="text-bg-primary">Fair</span> and{' '}
          <span className="text-bg-secondary">Open</span>
        </h1>
        <p className="text-text-secondary font-para text-lg max-w-2xl mx-auto mt-3">
          By using StackRead, you agree to the following terms and conditions.
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
                <CheckCircle size={20} className="text-success" /> Acceptance of
                Terms
              </h2>
              <p>
                By accessing and using StackRead, you accept and agree to be
                bound by the terms and provisions of this agreement. If you do
                not agree to abide by the above, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <AlertCircle size={20} className="text-warning" /> User Conduct
              </h2>
              <p>You agree not to use the service in any way that:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Violates any local, state, national, or international law.
                </li>
                <li>
                  Impersonates any person or entity, or falsely states or
                  otherwise misrepresents your affiliation with a person or
                  entity.
                </li>
                <li>
                  Interferes with or disrupts the service or servers or networks
                  connected to the service.
                </li>
                <li>
                  Attempts to gain unauthorized access to other user accounts or
                  computer systems.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <Shield size={20} className="text-bg-secondary" /> Intellectual
                Property
              </h2>
              <p>
                The StackRead logo, design elements, and proprietary scoring
                algorithms are the exclusive property of StackRead. You may not
                reproduce, duplicate, copy, sell, or exploit any portion of the
                service without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <FileText size={20} className="text-bg-primary" /> Disclaimer of
                Liability
              </h2>
              <p>
                StackRead provides data insights "as is". We make no warranties
                regarding the accuracy of the AI-generated suggestions or the
                completeness of the GitHub data. We are not liable for any
                decisions or actions taken based on the insights provided on
                this platform.
              </p>
              <p className="mt-2">
                StackRead is an independent service and is not affiliated with,
                endorsed by, or sponsored by GitHub or Google.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <span className="text-[120px] lg:text-[180px] font-black font-saira text-text-primary/10 select-none absolute -top-10 left-1/2 -translate-x-1/2 -z-10">
          404
        </span>

        <div className="bg-white dark:bg-text-light p-6 rounded-full shadow-xl mb-6 inline-block">
          <Icons.Frown size={64} className="text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold font-saira text-gray-900 dark:text-text-dark mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-text-dark/60 font-narrow text-lg max-w-sm mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      <button
        onClick={() => {
          navigate('/')
          window.scrollTo({ top, behavior: 'smooth' })
        }}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-text-dark font-saira font-bold rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:-translate-y-1 cursor-pointer"
      >
        <Icons.Home size={18} />
        <span>Go Back Home</span>
      </button>
    </div>
  )
}

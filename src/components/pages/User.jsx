import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Building,
  Users,
  Star,
  GitFork,
  Share2,
  FolderGit2,
  Terminal,
  Code2,
  Sparkles,
  Code,
  CodeXml,
  BookMarked,
  CircleCheck,
  Frown,
  Search,
} from 'lucide-react'
import { SiGithub, SiX } from 'react-icons/si'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
}

const calculateFallbackScore = (user, repos) => {
  const totalStars = repos.reduce((a, b) => a + b.stargazers_count, 0)
  const totalForks = repos.reduce((a, b) => a + b.forks_count, 0)
  const uniqueLangs = new Set(repos.map((r) => r.language).filter(Boolean)).size
  const descRepos = repos.filter(
    (r) => r.description && r.description.length > 0,
  ).length
  const totalRepos = repos.length

  let completeness = 0
  if (user.avatar_url) completeness += 4
  if (user.bio) completeness += 4
  if (user.location) completeness += 4
  if (user.blog) completeness += 4
  if (user.company) completeness += 4

  const starsScore = Math.min((totalStars / 500) * 10, 10)
  const descScore =
    totalRepos > 0 ? Math.min((descRepos / totalRepos) * 10, 10) : 0
  let quality = starsScore + descScore

  const forksScore = Math.min((totalForks / 200) * 10, 10)
  const followersScore = Math.min((user.followers / 500) * 10, 10)
  let impact = forksScore + followersScore

  let diversity = 0
  if (uniqueLangs >= 3) diversity = 15
  else if (uniqueLangs === 2) diversity = 10
  else if (uniqueLangs === 1) diversity = 5

  const openSourceScore = Math.min(user.public_repos * 1.5, 10)
  const activityScore = Math.min(user.public_repos * 1.5, 15)
  const activity = Math.min(activityScore + openSourceScore, 25)

  return {
    total: Math.min(
      completeness + quality + impact + diversity + activity,
      100,
    ),
    breakdown: {
      completeness: Math.round((completeness / 20) * 100),
      quality: Math.round((quality / 20) * 100),
      impact: Math.round((impact / 20) * 100),
      diversity: Math.round((diversity / 15) * 100),
      activity: Math.round((activity / 25) * 100),
    },
  }
}

export default function User() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { username } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [repos, setRepos] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  const [aiSuccess, setAiSuccess] = useState(false)

  const [contribData, setContribData] = useState(null)
  const [contribLoading, setContribLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ]

  const [copied, setCopied] = useState(false)

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Perl: '#0298c3',
    Vue: '#41b883',
    React: '#61dafb',
    SCSS: '#c6538c',
  }

  const formatDateForTooltip = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    const month = d.toLocaleDateString('en-US', { month: 'long' })
    const day = d.getDate()
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th'
    return `${month} ${day}${suffix}`
  }

  useEffect(() => {
    if (!username) return

    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    if (!stored.includes(username)) {
      stored.unshift(username)
      localStorage.setItem('recentSearches', JSON.stringify(stored.slice(0, 5)))
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) throw new Error('User not found')
        const userJson = await userRes.json()
        setUserData(userJson)

        const repoRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=stars`,
        )
        const repoJson = await repoRes.json()
        setRepos(repoJson)
        const fallbackResult = calculateFallbackScore(userJson, repoJson)
        setAnalysis({
          developerType: 'Open Source Enthusiast (Fallback)',
          score: fallbackResult.total,
          breakdown: fallbackResult.breakdown,
          strengths: ['Active contributor', 'Decent repository portfolio'],
          weaknesses: ['Click "Analyze with AI" for deeper insights.'],
          verdict: 'Press the button below to get detailed AI feedback.',
        })
      } catch (err) {
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [username])

  useEffect(() => {
    if (!username) return
    const fetchContributions = async () => {
      setContribLoading(true)
      try {
        const contribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?year=${selectedYear}`,
        )
        if (contribRes.ok) {
          setContribData(await contribRes.json())
        } else {
          console.warn(
            `Graph API returned status: ${contribRes.status}. Showing empty grid.`,
          )
          setContribData({ total: 0, contributions: [] })
        }
      } catch (e) {
        console.warn('Graph API failed', e)
        setContribData({ total: 0, contributions: [] })
      } finally {
        setContribLoading(false)
      }
    }
    fetchContributions()
  }, [username, selectedYear])

  const handleAIAnalysis = async () => {
    if (aiLoading || !userData) return
    setAiLoading(true)

    try {
      const languages = [
        ...new Set(repos.map((r) => r.language).filter(Boolean)),
      ]
      const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0)
      const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0)

      const prompt = `Return ONLY a valid JSON. No markdown, no extra text. Analyze this data: 
      Name: ${userData.name}, Bio: ${userData.bio}, Stars: ${totalStars}, Forks: ${totalForks}, Repos: ${userData.public_repos}, Followers: ${userData.followers}, Langs: ${languages}.
      Structure: {"developerType": "string", "score": number, "breakdown": {"completeness": number, "quality": number, "impact": number, "diversity": number, "activity": number}, "strengths": ["string"], "weaknesses": ["string"], "verdict": "string"}`

      const geminiRes = await fetch(
        `/.netlify/functions/gemini?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gemini-3.6-flash',
            input: prompt,
            stream: false,
          }),
        },
      )

      if (!geminiRes.ok) {
        if (geminiRes.status === 429) throw new Error('Rate Limit')
        throw new Error(`API Error: ${geminiRes.status}`)
      }

      const geminiJson = await geminiRes.json()
      const outputStep = geminiJson.steps?.find(
        (step) => step.type === 'model_output',
      )
      if (outputStep && outputStep.content && outputStep.content.length > 0) {
        const rawText = outputStep.content[0].text
        setAnalysis(JSON.parse(rawText))
        setAiSuccess(true)
      } else {
        throw new Error('Empty response')
      }
    } catch (e) {
      console.error('AI Error:', e)
      setAiSuccess(false)
      if (userData && repos) {
        const fallbackResult = calculateFallbackScore(userData, repos)
        setAnalysis((prev) => ({
          developerType: 'Open Source Enthusiast (Fallback)',
          score: fallbackResult.total,
          breakdown: fallbackResult.breakdown,
          strengths: ['Active contributor', 'Decent repository portfolio'],
          weaknesses: ['AI unavailable due to rate limits.'],
          verdict: 'AI is offline. Stats look solid!',
        }))
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading)
    return (
      <div className="w-full h-screen bg-bg mx-auto flex flex-col justify-center items-center text-text-primary gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-bg-primary/20 border-t-bg-primary rounded-full animate-spin"></div>
          <Terminal className="absolute text-bg-primary" size={28} />
        </div>
        <p className="text-xl lg:text-4xl font-logo font-bold animate-pulse tracking-widest uppercase">
          Scanning GitHub Mainframe...
        </p>
      </div>
    )

  if (!userData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <span className="text-[120px] lg:text-[180px] font-black font-saira text-text-primary/10 select-none absolute -top-10 left-1/2 -translate-x-1/2 -z-10">
            404
          </span>

          <div className="bg-white dark:bg-text-light p-6 rounded-full shadow-xl mb-6 inline-block">
            <Frown size={64} className="text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold font-saira text-gray-900 dark:text-text-dark mb-2">
          Developer Not Found
        </h1>
        <p className="text-gray-500 dark:text-text-dark/60 font-narrow text-lg max-w-sm mb-8">
          Oops! The user you are looking for doesn't exist or has changed his
          username.
        </p>

        <button
          onClick={() => {
            navigate('/')
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-text-dark font-saira font-bold rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:-translate-y-1 cursor-pointer"
        >
          <Search size={18} />
          <span>Back to Search</span>
        </button>
      </div>
    )

  const totalStars = repos.reduce((a, b) => a + b.stargazers_count, 0)
  const totalForks = repos.reduce((a, b) => a + b.forks_count, 0)
  const score = analysis?.score || 0
  const radius = 55
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={revealVariants}
      className="min-h-screen bg-bg px-4 lg:px-24 py-12 pb-20"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 font-heading font-bold text-[9px] lg:text-xs uppercase tracking-widest text-text-secondary bg-bg-primary/5 px-4 py-2 rounded-full border border-dashed border-bg-primary/20">
          <Terminal size={isDesktop ? 14 : 12} className="text-bg-primary" />{' '}
          Developer Identity Metrics
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-dashed border-bg-secondary/40 text-text-primary font-heading text-[10px] lg:text-sm hover:border-bg-primary transition-all shadow-sm cursor-pointer"
          >
            <Share2 size={isDesktop ? 16 : 12} /> Share Metrics
          </motion.button>
          {copied && (
            <div className="flex justify-center items-center gap-1.5 absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1b1f24] text-gray-200 text-xs font-sans rounded shadow-lg whitespace-nowrap pointer-events-none z-50 border border-[#30363d]">
              <CircleCheck size={16} className="text-success" /> Link copied!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-3xl p-8 shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-bg-primary/5 -rotate-12">
              <SiGithub size={120} />
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="relative p-1 bg-linear-to-r from-bg-primary to-bg-secondary rounded-full">
                <img
                  src={userData.avatar_url}
                  alt={username}
                  className="w-24 h-24 rounded-full border-4 border-card"
                />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text-primary">
                  {userData.name || username}
                </h1>

                <div className="flex items-center gap-3 flex-wrap mt-1">
                  <p className="text-bg-primary font-mono font-medium text-lg">
                    @{userData.login}
                  </p>
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${userData.hireable ? 'bg-success/15 border-success/30 text-success' : 'bg-danger/15 border-danger/30 text-danger'}`}
                  >
                    {userData.hireable !== null ? 'Hireable' : 'Not Hireable'}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary font-para max-w-lg">
                {userData.bio || 'No bio submitted.'}
              </p>
              <div className="flex flex-col flex-wrap gap-3 text-xs font-mono text-text-secondary bg-bg-primary/5 p-3 rounded-xl w-full border border-bg-primary/10">
                {userData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {userData.location}
                  </span>
                )}
                {userData.company && (
                  <span className="flex items-center gap-1">
                    <Building size={14} /> {userData.company}
                  </span>
                )}
                {userData.blog && (
                  <span className="flex items-center gap-1">
                    <LinkIcon size={14} />{' '}
                    <a
                      href={userData.blog}
                      target="_blank"
                      className="text-bg-primary hover:underline"
                    >
                      {userData.blog}
                    </a>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />{' '}
                  {new Date(userData.created_at).toLocaleDateString()}
                </span>
              </div>

              <a
                href={userData.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#222] px-4 py-2 rounded-xl text-card text-sm font-medium hover:bg-[#333]"
              >
                <SiGithub /> View GitHub
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: FolderGit2,
                label: 'Repos',
                value: userData.public_repos,
                color: 'text-bg-secondary',
              },
              {
                icon: Star,
                label: 'Stars',
                value: totalStars,
                color: 'text-yellow-500',
              },
              {
                icon: Users,
                label: 'Followers',
                value: userData.followers,
                color: 'text-pink-500',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-card p-4 rounded-2xl border border-bg-primary/10 text-center flex flex-col gap-1"
              >
                <stat.icon size={18} className={`mx-auto ${stat.color}`} />
                <span className="text-xl font-mono font-bold text-text-primary">
                  {stat.value.toLocaleString()}
                </span>
                <span className="text-[10px] tracking-widest text-text-secondary uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="bg-card px-10 py-6 rounded-3xl border border-dashed border-bg-secondary/40 relative group flex-1">
              <h3 className="text-xl font-bold font-heading mb-4 -ml-2 text-text-primary flex items-center gap-2">
                <CodeXml size={18} className="text-bg-primary" /> Language
                Breakdown
              </h3>
              <div className="space-y-3">
                {repos
                  .map((r) => r.language)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((lang) => {
                    const count = repos.filter(
                      (r) => r.language === lang,
                    ).length
                    const total = repos.filter((r) => r.language).length
                    const pct = Math.round((count / total) * 100)
                    const color = languageColors[lang] || '#64748b'
                    return (
                      <div key={lang} className="space-y-1">
                        <div className="flex justify-between text-xs font-heading items-center">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            ></span>
                            {lang}
                          </span>
                          <span className="text-text-primary font-bold">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-bg-primary/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          ></motion.div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-card p-6 rounded-3xl shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/30 relative">
            <div className="flex flex-col md:flex-row gap-6 items-center border-b border-dashed border-bg-secondary/20 pb-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="55"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="55"
                    stroke={score > 50 ? '#6366F1' : '#EF4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="text-4xl font-logo font-bold text-bg-primary">
                    {Math.floor(score)}
                  </span>
                  <span className="text-[9px] text-text-secondary font-mono tracking-widest">
                    SCORE
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-2 text-bg-secondary">
                  <Terminal size={18} />{' '}
                  <span className="font-mono text-sm tracking-wide">
                    {analysis?.developerType || 'Analyzing...'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {analysis?.breakdown &&
                    Object.entries(analysis.breakdown).map(([k, v]) => {
                      const pctWidth = Math.min(v, 100)
                      return (
                        <div
                          key={k}
                          className="flex items-center gap-2 text-xs font-mono"
                        >
                          <span className="w-23 text-text-secondary uppercase tracking-wider truncate">
                            {k}
                          </span>
                          <div className="flex-1 h-1 bg-bg-primary/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctWidth}%` }}
                              transition={{ duration: 1 }}
                              className="h-full bg-linear-to-r from-bg-primary to-bg-secondary rounded-full"
                            ></motion.div>
                          </div>
                          <span className="w-6 text-right text-text-primary font-bold">
                            {v}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={handleAIAnalysis}
                disabled={aiLoading || aiSuccess}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-heading font-medium transition-all shadow-sm ${
                  aiLoading || aiSuccess
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-bg-primary text-white hover:scale-105 cursor-pointer hover:shadow-[0_8px_32px_#6365f12e]'
                }`}
              >
                {aiLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : aiSuccess ? (
                  <>
                    <CircleCheck size={18} /> Analyzed
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
              <div className="bg-success/10 p-3 rounded-xl border border-success/20">
                <h5 className="font-mono font-bold text-success text-xs uppercase tracking-wider mb-1">
                  Strengths
                </h5>
                <ul className="list-disc pl-4 text-text-secondary text-xs space-y-0.5">
                  {analysis?.strengths?.slice(0, 2).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-warning/10 p-3 rounded-xl border border-warning/20">
                <h5 className="font-mono font-bold text-warning text-xs uppercase tracking-wider mb-1">
                  Focus Areas
                </h5>
                <ul className="list-disc pl-4 text-text-secondary text-xs space-y-0.5">
                  {analysis?.weaknesses?.slice(0, 2).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-card p-6 rounded-3xl border border-dashed border-bg-secondary/40 relative group"
          >
            <h3 className="text-xl font-bold font-heading mb-4 text-text-primary flex items-center gap-2">
              <BookMarked size={18} className="text-bg-secondary" /> Top
              Repositories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 4)
                .map((r) => (
                  <a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-bg/60 border border-dashed border-bg-secondary/30 hover:border-bg-primary transition-all flex flex-col justify-between group/repo"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-heading font-bold text-text-primary group-hover/repo:text-bg-primary truncate">
                          {r.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-heading text-text-secondary">
                          <span className="flex items-center gap-0.5">
                            <Star
                              size={10}
                              fill="oklch(79.5% 0.184 86.047)"
                              className="text-yellow-500"
                            />
                            {r.stargazers_count}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-para text-text-secondary line-clamp-2 mb-3">
                        {r.description || 'No manifesto provided.'}
                      </p>
                    </div>
                    {r.language && (
                      <span className="inline-block text-[9px] font-heading uppercase tracking-widest px-2 py-0.5 bg-bg-primary/10 text-bg-primary rounded-md w-fit">
                        {r.language}
                      </span>
                    )}
                  </a>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {contribLoading ? (
        <div className="w-full mt-12 h-24 flex justify-center items-center text-text-secondary font-mono text-sm relative">
          Loading activity graph...
        </div>
      ) : contribData ? (
        <div className="w-full mt-6 bg-card rounded-3xl p-6 shadow-[0_8px_32px_#6365f12e] border border-dashed border-bg-secondary/20 relative">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h3 className="text-xl font-bold font-heading text-text-primary flex items-center gap-2">
              <Calendar size={20} className="text-bg-primary" /> Contribution
              Activity
            </h3>

            <span className="hidden lg:block ml-2 text-sm font-normal font-mono text-text-secondary">
              {typeof contribData.total === 'number'
                ? contribData.total
                : Object.values(contribData.total || {}).reduce(
                    (a, b) => a + b,
                    0,
                  )}{' '}
              contributions in {selectedYear}
            </span>
            <div className="hidden lg:flex flex-col gap-y-2 absolute top-24 right-16 z-40">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3.5 py-1 rounded-md text-sm font-mono transition-colors cursor-pointer ${
                    selectedYear === year
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/5'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex flex-col w-fit">
              <div className="flex ml-9 mb-2 text-[10px] font-mono font-semibold text-text-secondary relative h-5">
                {(() => {
                  const getMonday = (d) => {
                    const date = new Date(d)
                    const day = date.getDay()
                    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
                    date.setDate(diff)
                    return date
                  }
                  const startDate = getMonday(new Date(selectedYear, 0, 1))
                  const positions = []
                  for (let m = 0; m < 12; m++) {
                    const firstOfMonth = new Date(selectedYear, m, 1)
                    const diffDays = Math.floor(
                      (firstOfMonth - startDate) / (1000 * 60 * 60 * 24),
                    )
                    if (diffDays >= 0) {
                      const leftOffset = diffDays * 2.31
                      positions.push({
                        name: firstOfMonth.toLocaleString('default', {
                          month: 'short',
                        }),
                        left: leftOffset,
                      })
                    }
                  }
                  return positions.map((m, i) => (
                    <div
                      key={i}
                      className="absolute w-6 text-center text-[11px] tracking-wide -ml-3"
                      style={{ left: `${m.left}px` }}
                    >
                      {m.name}
                    </div>
                  ))
                })()}
              </div>

              <div className="flex gap-1">
                <div className="flex flex-col justify-between text-[10px] font-mono font-semibold text-text-secondary pt-1 pb-1 h-26 w-8 items-end pr-2">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div className="flex gap-1 lg:flex-wrap max-w-full">
                  {(() => {
                    const getMonday = (d) => {
                      const date = new Date(d)
                      const day = date.getDay()
                      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
                      date.setDate(diff)
                      return date
                    }
                    const startDate = getMonday(new Date(selectedYear, 0, 1))
                    const weeks = []
                    let current = new Date(startDate)
                    for (let w = 0; w < 53; w++) {
                      const days = []
                      for (let d = 0; d < 7; d++) {
                        days.push(current.toISOString().split('T')[0])
                        current.setDate(current.getDate() + 1)
                      }
                      weeks.push(days)
                    }
                    const contribMap = new Map()
                    contribData.contributions.forEach((item) =>
                      contribMap.set(item.date, item.count),
                    )
                    return weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((dateStr, di) => {
                          const year = new Date(dateStr).getFullYear()
                          if (year !== selectedYear)
                            return (
                              <div
                                key={`${wi}-${di}`}
                                className="w-3 h-3 rounded-xs bg-transparent pointer-events-none"
                              />
                            )
                          const count = contribMap.get(dateStr) || 0
                          let bgClass = 'bg-bg-primary/10'
                          if (count === 1) bgClass = 'bg-[#0e4429]'
                          else if (count === 2) bgClass = 'bg-[#006d32]'
                          else if (count === 3) bgClass = 'bg-[#26a641]'
                          else if (count >= 4) bgClass = 'bg-[#39d353]'
                          return (
                            <div key={`${wi}-${di}`} className="relative group">
                              <div
                                className={`w-3 h-3 rounded-xs ${bgClass} hover:ring-1 hover:ring-gray-500 transition-all cursor-default`}
                              />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1b1f24] text-gray-200 text-[10px] font-sans rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#30363d]">
                                {count === 0
                                  ? `No contributions on ${formatDateForTooltip(dateStr)}.`
                                  : `${count} contributions on ${formatDateForTooltip(dateStr)}.`}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:hidden flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-4">
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <span className="text-[12px] lg:text-sm font-normal tracking-tighter lg:tracking-normal font-mono text-text-secondary">
                {typeof contribData.total === 'number'
                  ? contribData.total
                  : Object.values(contribData.total || {}).reduce(
                      (a, b) => a + b,
                      0,
                    )}{' '}
                contributions in {selectedYear}
              </span>

              <div className="relative">
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="px-3 py-1.5 bg-bg-primary/5 hover:bg-bg-primary/10 border border-dashed border-bg-secondary/40 rounded-md text-sm font-mono transition-colors flex items-center gap-1.5"
                >
                  {selectedYear}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className={`transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M2 3L5 6L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </button>

                {isYearDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-card border border-dashed border-bg-secondary/40 shadow-lg rounded-xl overflow-hidden z-50 min-w-20">
                    {years.map((year) => (
                      <div
                        key={year}
                        onClick={() => {
                          setSelectedYear(year)
                          setIsYearDropdownOpen(false)
                        }}
                        className={`px-4 py-2 text-sm font-mono cursor-pointer hover:bg-bg-primary/5 transition-colors ${selectedYear === year ? 'text-bg-primary font-bold bg-bg-primary/5' : 'text-text-secondary'}`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-12 h-24 flex justify-center items-center text-text-secondary/60 font-mono text-sm">
          Contribution data unavailable for this user.
        </div>
      )}
    </motion.div>
  )
}

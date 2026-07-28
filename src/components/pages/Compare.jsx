import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Star,
  GitFork,
  FolderGit2,
  User,
  Sparkles,
  Award,
  ArrowRight,
  Swords,
  Calendar,
  Check,
  X,
  BookMarked,
  CodeXml,
  Trophy,
} from 'lucide-react'
import { SiGithub } from 'react-icons/si'

const calculateFallbackScore = (user, repos) => {
  if (!user || !repos) return { total: 0, breakdown: {} }

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
      completeness: Math.round(completeness),
      quality: Math.round(quality),
      impact: Math.round(impact),
      diversity: Math.round(diversity),
      activity: Math.round(activity),
    },
  }
}

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
}

const getDeveloperType = (repos) => {
  const langs = repos.map((r) => r.language).filter(Boolean)
  if (langs.length === 0) return 'Full Stack Developer'

  const topLang = langs[0]
  if (['C', 'C++', 'Rust', 'Go'].includes(topLang)) return 'Systems / OS'
  if (['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue'].includes(topLang))
    return 'Frontend / UI'
  if (['Python', 'R'].includes(topLang)) return 'AI / Data Science'
  if (['Java', 'C#', 'PHP'].includes(topLang)) return 'Backend / Enterprise'
  return 'Full Stack Developer'
}

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

export default function Compare() {
  const navigate = useNavigate()

  const [query1, setQuery1] = useState('')
  const [query2, setQuery2] = useState('')

  const [user1, setUser1] = useState(null)
  const [user2, setUser2] = useState(null)
  const [repos1, setRepos1] = useState([])
  const [repos2, setRepos2] = useState([])

  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [error1, setError1] = useState(null)
  const [error2, setError2] = useState(null)

  const fetchUser = async (
    username,
    setUser,
    setRepos,
    setLoading,
    setError,
  ) => {
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if (!userRes.ok) throw new Error('User not found')
      const userJson = await userRes.json()
      setUser(userJson)

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=stars`,
      )
      const repoJson = await repoRes.json()
      setRepos(repoJson)
    } catch (err) {
      setError(err.message)
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch1 = () =>
    fetchUser(query1, setUser1, setRepos1, setLoading1, setError1)
  const handleSearch2 = () =>
    fetchUser(query2, setUser2, setRepos2, setLoading2, setError2)

  const handleSwordsSearch = () => {
    if (query1.trim()) {
      if (!user1 || user1.login !== query1.trim()) {
        fetchUser(query1, setUser1, setRepos1, setLoading1, setError1)
      }
    }
    if (query2.trim()) {
      if (!user2 || user2.login !== query2.trim()) {
        fetchUser(query2, setUser2, setRepos2, setLoading2, setError2)
      }
    }
  }

  const score1 = user1 ? calculateFallbackScore(user1, repos1).total : 0
  const score2 = user2 ? calculateFallbackScore(user2, repos2).total : 0
  const completeness1 = user1
    ? calculateFallbackScore(user1, repos1).breakdown.completeness
    : 0
  const completeness2 = user2
    ? calculateFallbackScore(user2, repos2).breakdown.completeness
    : 0

  let winner = null
  if (user1 && user2) {
    if (score1 > score2) winner = 'user1'
    else if (score2 > score1) winner = 'user2'
    else winner = 'draw'
  }

  const renderUserColumn = (
    user,
    repos,
    score,
    completeness,
    loading,
    error,
    label,
    isWinner,
  ) => {
    if (loading)
      return (
        <div className="flex-1 bg-card rounded-3xl p-12 shadow-sm border border-dashed border-bg-secondary/30 mx-auto flex justify-center items-center min-h-150">
          <div className="flex flex-col items-center gap-2 text-text-secondary">
            <div className="w-10 h-10 border-4 border-bg-primary/20 border-t-bg-primary rounded-full animate-spin"></div>
            <p className="text-sm font-mono tracking-widest animate-pulse">
              Loading {label}...
            </p>
          </div>
        </div>
      )

    if (error)
      return (
        <div className="flex-1 bg-card rounded-3xl p-12 shadow-sm border border-dashed border-danger/30 mx-auto flex justify-center items-center min-h-150 text-danger/80">
          <div className="text-center flex flex-col items-center gap-2">
            <User size={40} className="opacity-40" />
            <p className="font-heading font-bold text-lg">{error}</p>
            <p className="text-sm font-para">
              Please try a different username.
            </p>
          </div>
        </div>
      )

    if (!user)
      return (
        <div className="flex-1 bg-card rounded-3xl p-12 shadow-sm border border-dashed border-bg-secondary/30 mx-auto flex justify-center items-center min-h-150 text-text-secondary/60">
          <div className="text-center flex flex-col items-center gap-2">
            <Search size={40} className="opacity-40" />
            <p className="font-heading font-bold text-lg">Enter {label}</p>
            <p className="text-sm font-para">Search for a GitHub username.</p>
          </div>
        </div>
      )

    const totalStars = repos.reduce((a, b) => a + b.stargazers_count, 0)
    const totalForks = repos.reduce((a, b) => a + b.forks_count, 0)
    const topLang =
      repos.filter((r) => r.language).map((r) => r.language)[0] || 'N/A'
    const devType = getDeveloperType(repos)
    const joined = new Date(user.created_at).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    const roundedScore = Math.round(score)

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset =
      circumference - (roundedScore / 100) * circumference

    return (
      <div className="flex flex-col gap-6 flex-1 min-w-[320px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card rounded-3xl p-8 shadow-[0_8px_32px_#6365f12e] border border-dashed relative overflow-hidden flex flex-col transition-all duration-300 ${isWinner === true ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.15)]' : 'border-bg-secondary/30'}`}
        >
          {isWinner === true && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-950 px-4 py-1.5 rounded-bl-2xl font-heading font-bold text-xs flex items-center gap-2 shadow-lg z-10">
              <Award size={16} /> Top Dev
            </div>
          )}

          {isWinner === true && (
            <div className="absolute top-9 right-8 z-0 pointer-events-none opacity-70">
              <div className="bg-yellow-400/20 border-2 border-dashed border-yellow-400/60 p-4 rounded-full transform -rotate-6 shadow-md">
                <div className="flex flex-col items-center text-gray-500">
                  <Trophy size={45} className="-rotate-18" />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center text-center gap-1 mb-5">
            <div className="relative p-1 bg-linear-to-r from-bg-primary to-bg-secondary rounded-full">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-20 h-20 rounded-full border-4 border-card"
              />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-text-primary mt-2">
                {user.name || user.login}
              </h3>
              <p className="text-bg-primary font-mono text-sm">@{user.login}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6 border-y border-bg-primary/10 py-4">
            <div className="text-center flex flex-col gap-0.5">
              <FolderGit2 size={16} className="mx-auto text-bg-secondary" />
              <span className="text-lg font-bold font-mono text-text-primary">
                {user.public_repos}
              </span>
              <span className="text-[9px] tracking-widest text-text-secondary uppercase">
                Repos
              </span>
            </div>
            <div className="text-center flex flex-col gap-0.5 border-x border-bg-primary/10 px-2">
              <Star size={16} className="mx-auto text-yellow-500" />
              <span className="text-lg font-bold font-mono text-text-primary">
                {formatNumber(totalStars)}
              </span>
              <span className="text-[9px] tracking-widest text-text-secondary uppercase">
                Stars
              </span>
            </div>
            <div className="text-center flex flex-col gap-0.5">
              <Users size={16} className="mx-auto text-pink-500" />
              <span className="text-lg font-bold font-mono text-text-primary">
                {formatNumber(user.followers)}
              </span>
              <span className="text-[9px] tracking-widest text-text-secondary uppercase">
                Followers
              </span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke={roundedScore > 50 ? '#6366F1' : '#EF4444'}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="text-2xl font-logo font-bold text-bg-primary">
                  {roundedScore}
                </span>
                <span className="text-[8px] text-text-secondary font-mono tracking-widest">
                  SCORE
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm font-para mb-6 px-2">
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Developer type
              </span>
              <span className="bg-bg-primary/10 text-bg-primary px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                {devType}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Public repos
              </span>
              <span className="font-bold font-mono text-cyan-400">
                {user.public_repos}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Company
              </span>
              <span className="font-bold font-mono text-gray-700">
                {user.company || 'none'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Following
              </span>
              <span className="font-bold font-mono text-pink-500">
                {formatNumber(user.following)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Top language
              </span>
              <span className="flex items-center gap-2 font-mono text-text-primary font-bold">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: languageColors[topLang] || '#64748b',
                  }}
                ></span>
                {topLang}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Joined
              </span>
              <span className="font-mono text-text-primary flex items-center gap-1">
                <Calendar size={14} className="text-bg-secondary" /> {joined}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5">
              <span className="text-text-secondary font-medium tracking-wide">
                Hireable
              </span>
              <span
                className={`flex items-center gap-1 font-mono font-bold text-xs uppercase ${user.hireable ? 'text-green-500' : 'text-red-500'}`}
              >
                {user.hireable ? (
                  <>
                    <Check size={16} /> Yes
                  </>
                ) : (
                  <>
                    <X size={16} /> No
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-bg-primary/5 last:border-0">
              <span className="text-text-secondary font-medium tracking-wide">
                Profile complete
              </span>
              <span className="font-mono font-bold text-xs text-success">
                {completeness >= 50 ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <Check size={16} /> Complete
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <X size={16} /> Incomplete
                  </div>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              navigate(`/user/${user.login}`)
              window.scrollTo({ top, behavior: 'smooth' })
            }}
            className="w-full flex justify-center items-center cursor-pointer gap-2 py-2.5 bg-bg-primary/10 hover:bg-bg-primary text-text-secondary hover:text-white rounded-xl transition-all text-sm font-heading font-medium border border-dashed border-bg-primary/20 hover:border-transparent group/btn"
          >
            <Sparkles size={14} className="group-hover/btn:animate-pulse" />{' '}
            Deep AI Analysis{' '}
            <ArrowRight
              size={14}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div
            className={`bg-card rounded-2xl p-5 border border-dashed ${isWinner === true ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.15)]' : 'border-bg-secondary/30'} shadow-sm`}
          >
            <h4 className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-text-secondary mb-4">
              <CodeXml size={14} className="text-bg-primary" /> Languages
            </h4>
            <div className="space-y-3">
              {repos
                .map((r) => r.language)
                .filter((v, i, a) => a.indexOf(v) === i)
                .filter(Boolean)
                .slice(0, 4)
                .map((lang) => {
                  const count = repos.filter((r) => r.language === lang).length
                  const total = repos.filter((r) => r.language).length
                  const pct = Math.round((count / total) * 100)
                  const color = languageColors[lang] || '#64748b'
                  return (
                    <div key={lang} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="flex items-center gap-2 text-text-secondary font-semibold">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
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

          <div
            className={`bg-card rounded-2xl p-5 border border-dashed ${isWinner === true ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.15)]' : 'border-bg-secondary/30'} shadow-sm`}
          >
            <h4 className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-text-secondary mb-4">
              <BookMarked size={14} className="text-bg-secondary" /> Top Repos
            </h4>
            <div className="flex flex-col gap-3">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 3)
                .map((r) => (
                  <a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-bg/60 p-3 rounded-xl border border-bg-primary/5 hover:border-bg-primary/30 transition-colors flex flex-col gap-0.5 group/repo"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-heading font-bold text-bg-primary group-hover/repo:underline">
                        {r.name}
                      </span>
                      <div className="flex gap-2 text-[10px] font-mono text-text-secondary">
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="text-yellow-500" />{' '}
                          {formatNumber(r.stargazers_count)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork size={10} className="text-blue-400" />{' '}
                          {formatNumber(r.forks_count)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] font-para text-text-secondary line-clamp-1">
                      {r.description || 'No description'}
                    </p>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="min-h-screen bg-bg px-4 lg:px-24 py-12 pb-20"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-text-secondary bg-bg-primary/5 px-4 py-2 rounded-full border border-dashed border-bg-primary/20 mb-3">
          <Swords size={14} className="text-bg-primary" /> Head-to-Head
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
          Compare Developer Profiles
        </h1>
        <p className="text-text-secondary font-para text-lg max-w-xl mx-auto mt-2">
          Enter two GitHub usernames to see who dominates the leaderboard. Deep
          AI analysis is just one click away!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center max-w-5xl mx-auto mb-12">
        <div className="relative lg:col-span-2 group">
          <span className="absolute inset-0 border border-dashed border-bg-secondary/30 bg-bg-primary/5 rounded-xl transition-colors group-hover:bg-bg-primary/10"></span>
          <div className="relative flex items-center px-4 py-3">
            <input
              type="search"
              value={query1}
              onChange={(e) => setQuery1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch1()}
              placeholder="User 1 ..."
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 font-heading font-medium"
            />
            <button
              onClick={handleSearch1}
              className="text-bg-primary hover:text-bg-secondary transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={handleSwordsSearch}
            className="bg-text-primary text-card w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-dashed border-bg-primary/30 cursor-pointer hover:scale-110 transition-transform"
          >
            <Swords size={24} />
          </motion.div>
        </div>

        <div className="relative lg:col-span-2 group">
          <span className="absolute inset-0 border border-dashed border-bg-secondary/30 bg-bg-primary/5 rounded-xl transition-colors group-hover:bg-bg-primary/10"></span>
          <div className="relative flex items-center px-4 py-3">
            <input
              type="search"
              value={query2}
              onChange={(e) => setQuery2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch2()}
              placeholder="User 2 ..."
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 font-heading font-medium"
            />
            <button
              onClick={handleSearch2}
              className="text-bg-primary hover:text-bg-secondary transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto justify-center items-start">
        {renderUserColumn(
          user1,
          repos1,
          score1,
          completeness1,
          loading1,
          error1,
          'User 1',
          winner === 'user1',
        )}
        {renderUserColumn(
          user2,
          repos2,
          score2,
          completeness2,
          loading2,
          error2,
          'User 2',
          winner === 'user2',
        )}
      </div>

      {winner === 'draw' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mt-8 text-center bg-card rounded-3xl p-6 border border-dashed border-warning/30 shadow-sm"
        >
          <p className="text-text-secondary font-para text-lg">
            It's a{' '}
            <span className="text-warning font-bold font-heading">Draw!</span>{' '}
            Both developers scored{' '}
            <span className="font-mono font-bold text-bg-primary">
              {Math.round(score1)}
            </span>{' '}
            points.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

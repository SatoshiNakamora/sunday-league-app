import Navigation from '@/components/Navigation'
import { getDashboardStats } from '@/app/actions/dashboard'
import { Trophy, Target, Users, Calendar, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to your Sunday League manager</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Players"
            value={stats.totalPlayers}
            icon={Users}
            delay="stagger-1"
          />
          <StatCard
            title="Matches Played"
            value={stats.completedMatches}
            icon={Trophy}
            delay="stagger-2"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingMatches}
            icon={Calendar}
            delay="stagger-3"
          />
          <StatCard
            title="Total Games"
            value={stats.totalMatches}
            icon={TrendingUp}
            delay="stagger-4"
          />
        </div>

        {/* Top Performers */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Top Scorers */}
          <div className="card animate-slide-reveal stagger-1 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-500/20 clip-corner-sm">
                <Target className="h-6 w-6 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
              </div>
              <h2 className="card-header !mb-0">Top Scorers</h2>
            </div>
            {stats.topScorers.length > 0 ? (
              <div className="space-y-3">
                {stats.topScorers.map((player, index) => (
                  <div
                    key={player.id}
                    className="group flex justify-between items-center py-3 px-3 border-l-2 border-transparent hover:border-red-400 hover:bg-red-500/5 transition-all duration-300 clip-corner-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-cyan-500/50 w-8 font-mono">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white uppercase tracking-wide">
                          {player.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">({player.primaryPosition})</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-red-400 font-mono tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      {player.goals}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm uppercase tracking-wide">No goals recorded yet</p>
            )}
          </div>

          {/* Top MOTM */}
          <div className="card animate-slide-reveal stagger-2 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-500/20 clip-corner-sm">
                <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
              </div>
              <h2 className="card-header !mb-0">Most MOTM Awards</h2>
            </div>
            {stats.topMOTM.length > 0 ? (
              <div className="space-y-3">
                {stats.topMOTM.map((player, index) => (
                  <div
                    key={player.id}
                    className="group flex justify-between items-center py-3 px-3 border-l-2 border-transparent hover:border-yellow-400 hover:bg-yellow-500/5 transition-all duration-300 clip-corner-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-cyan-500/50 w-8 font-mono">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white uppercase tracking-wide">
                          {player.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">({player.primaryPosition})</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-yellow-400 font-mono tabular-nums drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                      {player.motmCount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm uppercase tracking-wide">No MOTM awards yet</p>
            )}
          </div>

          {/* Highest Rated */}
          <div className="card animate-slide-reveal stagger-3 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 clip-corner-sm">
                <TrendingUp className="h-6 w-6 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              </div>
              <h2 className="card-header !mb-0">Highest Rated</h2>
            </div>
            {stats.highestRated.length > 0 ? (
              <div className="space-y-3">
                {stats.highestRated.map((player, index) => (
                  <div
                    key={player.id}
                    className="group flex justify-between items-center py-3 px-3 border-l-2 border-transparent hover:border-green-400 hover:bg-green-500/5 transition-all duration-300 clip-corner-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-cyan-500/50 w-8 font-mono">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white uppercase tracking-wide">
                          {player.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">({player.primaryPosition})</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-green-400 font-mono tabular-nums drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                      {player.compositeRating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm uppercase tracking-wide">No ratings yet</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  delay,
}: {
  title: string
  value: number
  icon: typeof Users
  delay?: string
}) {
  return (
    <div className={`stat-card group hover:scale-105 transition-all duration-300 animate-slide-reveal ${delay || ''}`}>
      <div className="flex-1">
        <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest mb-2">
          {title}
        </p>
        <p className="text-5xl font-black text-white font-mono tabular-nums neon-text-cyan">
          {value.toString().padStart(2, '0')}
        </p>
      </div>
      <div className="stat-card-icon group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
      </div>
    </div>
  )
}
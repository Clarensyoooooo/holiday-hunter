"use client"

import { useState } from "react"
import { Trophy, Medal, Crown, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import type { CountryHolidays } from "@/lib/types"

interface LazynessLeaderboardProps {
  leaderboard: CountryHolidays[]
}

export function LazynessLeaderboard({ leaderboard }: LazynessLeaderboardProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const displayedCountries = showAll ? leaderboard : leaderboard.slice(0, 10)
  // 1. Calculate the spread (Min and Max)
  const maxHolidays = leaderboard[0]?.holidayCount || 1
  // Since leaderboard is sorted descending, the last item is the min
  const minHolidays = leaderboard.length > 0 
    ? leaderboard[leaderboard.length - 1].holidayCount 
    : 0

  // 2. The Visual Trick Function
  const getBarWidth = (count: number) => {
    if (maxHolidays === minHolidays) return 100 // Avoid division by zero
    
    // Calculate raw percentage relative to the spread (0 to 1)
    const distinctness = (count - minHolidays) / (maxHolidays - minHolidays)
    
    // Scale it to 15% - 100% so the smallest bar is still visible
    return 15 + (distinctness * 85)
  }

  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Crown className="w-6 h-6 text-tropical-yellow" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank + 1}</span>
        )
    }
  }

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 0:
        return "from-tropical-yellow/20 to-tropical-orange/20 border-tropical-yellow/30"
      case 1:
        return "from-gray-500/20 to-gray-400/20 border-gray-400/30"
      case 2:
        return "from-amber-700/20 to-amber-600/20 border-amber-600/30"
      default:
        return "from-secondary to-secondary border-border"
    }
  }

  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tropical-orange/10 text-tropical-orange text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            The Rankings
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Laziness</span> Leaderboard
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Which country has mastered the art of taking time off? Find out who&apos;s winning the holiday game!
          </p>
        </div>

        <div className="space-y-3">
          {displayedCountries.map((country, index) => (
            <div key={country.code}>
              <button
                onClick={() => setExpanded(expanded === country.code ? null : country.code)}
                className={`w-full glass-card rounded-2xl p-4 md:p-5 border bg-gradient-to-r ${getRankColors(index)} hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{getRankIcon(index)}</div>
                  <span className="text-3xl">{country.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-lg text-foreground">{country.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden max-w-xs">
                       <div
  className="h-full bg-gradient-to-r from-tropical-orange to-tropical-yellow rounded-full transition-all duration-500"
  style={{ width: `${getBarWidth(country.holidayCount)}%` }} // <--- USE YOUR NEW FUNCTION
/>
                      </div>
                      <span className="text-sm text-muted-foreground">{country.holidayCount} days</span>
                    </div>
                  </div>
                  {expanded === country.code ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expanded === country.code && (
                <div className="mt-2 glass-card rounded-2xl p-4 md:p-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-tropical-cyan" />
                    <h4 className="font-semibold text-foreground">All Holidays in {country.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {country.holidays.map(
                      (holiday: { date: string; name: string; localName: string }, hIndex: number) => (
                        <div
                          key={hIndex}
                          className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <span className="text-tropical-orange font-mono text-sm">
                            {new Date(holiday.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span className="text-sm text-foreground truncate">{holiday.localName || holiday.name}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {leaderboard.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-secondary transition-colors text-foreground"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show All {leaderboard.length} Countries
              </>
            )}
          </button>
        )}
      </div>
    </section>
  )
}

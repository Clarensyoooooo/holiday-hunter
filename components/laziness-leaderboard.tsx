"use client"

import { useState } from "react"
import { Crown, ChevronDown, ChevronUp } from "lucide-react"
import type { CountryHolidays } from "@/lib/types"

interface LazynessLeaderboardProps {
  leaderboard: CountryHolidays[]
}

export function LazynessLeaderboard({ leaderboard }: LazynessLeaderboardProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false) // Toggle for the long list
  
  if (leaderboard.length < 3) return null

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)
  
  // Show only 7 more (Top 10 total) by default, or ALL if toggled
  const displayedRest = showAll ? rest : rest.slice(0, 7)

  return (
    <div className="flex flex-col gap-12">
      <div className="text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-yellow to-neon-orange">Podium</span>
        </h2>
      </div>

      {/* Podium Visualization */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 min-h-[400px] mb-12">
        {/* 2nd Place */}
        <div className="order-2 md:order-1 flex-1 flex flex-col items-center">
          <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: "0.2s" }}>{top3[1].emoji}</div>
          <div className="text-xl font-bold text-white text-center mb-2">{top3[1].name}</div>
          <div className="text-neon-cyan font-mono font-bold mb-2">{top3[1].holidayCount} days</div>
          <div className="w-full h-48 glass-card-maximal border-neon-cyan/30 rounded-t-2xl bg-gradient-to-t from-neon-cyan/20 to-transparent relative group">
             <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors">2</div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="order-1 md:order-2 flex-1 flex flex-col items-center z-10 scale-110 origin-bottom">
          <Crown className="w-12 h-12 text-neon-yellow mb-2 animate-pulse" />
          <div className="text-6xl mb-4 animate-bounce">{top3[0].emoji}</div>
          <div className="text-2xl font-black text-white text-center mb-2">{top3[0].name}</div>
          <div className="text-neon-yellow font-mono font-bold mb-2 text-xl">{top3[0].holidayCount} days</div>
          <div className="w-full h-64 glass-card-maximal border-neon-yellow/50 rounded-t-2xl bg-gradient-to-t from-neon-yellow/20 to-transparent relative shadow-[0_0_50px_-10px_rgba(250,204,21,0.3)] group">
             <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-white/10 group-hover:text-white/20 transition-colors">1</div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="order-3 flex-1 flex flex-col items-center">
          <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: "0.4s" }}>{top3[2].emoji}</div>
          <div className="text-xl font-bold text-white text-center mb-2">{top3[2].name}</div>
          <div className="text-neon-orange font-mono font-bold mb-2">{top3[2].holidayCount} days</div>
          <div className="w-full h-32 glass-card-maximal border-neon-orange/30 rounded-t-2xl bg-gradient-to-t from-neon-orange/20 to-transparent relative group">
             <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors">3</div>
          </div>
        </div>
      </div>

      {/* The Rest List */}
      <div className="glass-card-maximal rounded-3xl p-6 md:p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-muted-foreground">#4 - #{leaderboard.length}</span>
          Honorable Mentions
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {displayedRest.map((country, idx) => (
            <div key={country.code} className="flex flex-col">
              <div 
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:scale-[1.01] cursor-pointer"
                onClick={() => setExpanded(expanded === country.code ? null : country.code)}
              >
                <span className="font-mono text-muted-foreground w-8 text-right">#{idx + 4}</span>
                <span className="text-2xl">{country.emoji}</span>
                <span className="font-bold text-foreground flex-1">{country.name}</span>
                
                <div className="flex items-center gap-4">
                  <div className="h-2 w-24 md:w-48 bg-black/50 rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-pink" 
                      style={{ width: `${(country.holidayCount / top3[0].holidayCount) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-neon-pink font-bold">{country.holidayCount}</span>
                  
                  <div className="p-2 rounded-full transition-colors">
                    {expanded === country.code ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {expanded === country.code && (
                <div className="mt-2 mb-4 mx-2 z-20 glass-card-maximal p-4 rounded-xl animate-in slide-in-from-top-2 border-t-0 border-neon-purple/30">
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                     {country.holidays.map((h, i) => (
                        <div key={i} className="flex flex-col p-2 bg-black/40 rounded border border-white/5 hover:border-neon-cyan/50 transition-colors">
                          <div className="text-neon-cyan text-xs font-mono mb-1">{new Date(h.date).toLocaleDateString()}</div>
                          <div className="text-white text-sm font-medium truncate" title={h.localName || h.name}>
                            {h.localName || h.name}
                          </div>
                        </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SHOW MORE / LESS BUTTON */}
        {rest.length > 7 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-300 font-mono text-sm uppercase tracking-wider"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Collapse List
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  View All {leaderboard.length} Countries
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
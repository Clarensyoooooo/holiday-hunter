"use client"

import { useState, useEffect } from "react"
import { Clock, Sparkles, PartyPopper } from "lucide-react"
import type { UpcomingHoliday } from "@/lib/types"

interface UpcomingBreaksProps {
  holidays: UpcomingHoliday[]
}

export function UpcomingBreaks({ holidays }: UpcomingBreaksProps) {
  const [now, setNow] = useState(new Date())

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Ticker animation duplication
  const displayHolidays = [...holidays, ...holidays, ...holidays]
  
  const nextHoliday = holidays[0]

  const getTimeUntil = (dateStr: string) => {
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    const diff = target.getTime() - now.getTime()

    const isToday = new Date(dateStr).toDateString() === now.toDateString()

    if (isToday) return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (diff <= 0) return { isToday: false, days: 0, hours: 0, minutes: 0, seconds: 0 }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { isToday: false, days, hours, minutes, seconds }
  }

  if (!nextHoliday) return null

  const countdown = getTimeUntil(nextHoliday.date)

  return (
    <div className="flex flex-col gap-0">
      
      {/* 1. THE MAIN TIMER SECTION */}
      <div className="w-full bg-black border-y border-white/10 py-12 md:py-16 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-neon-pink/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-pink/30 bg-neon-pink/10 text-neon-pink font-mono text-sm tracking-widest uppercase mb-6 animate-pulse">
            <Clock className="w-4 h-4" /> Next Global Holiday
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
            {nextHoliday.emoji} {nextHoliday.name}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Observed in <span className="text-white font-bold">{nextHoliday.country}</span>
          </p>

          {countdown.isToday ? (
             <div className="animate-bounce">
                <div className="inline-block bg-neon-pink text-black px-8 py-4 rounded-full text-2xl md:text-4xl font-black shadow-[0_0_50px_rgba(236,72,153,0.5)]">
                  <PartyPopper className="inline-block w-8 h-8 mr-2 -mt-1" />
                  HAPPENING NOW!
                </div>
              </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { value: countdown.days, label: "DAYS" },
                { value: countdown.hours, label: "HRS" },
                { value: countdown.minutes, label: "MINS" },
                { value: countdown.seconds, label: "SECS" },
              ].map((item, i) => (
                <div key={item.label} className="glass-card-maximal p-6 rounded-2xl flex flex-col items-center justify-center border-neon-pink/20">
                  <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono tabular-nums">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-neon-pink font-mono text-xs tracking-[0.2em] mt-2">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. THE TICKER TAPE (Connected directly below) */}
      <div className="w-full overflow-hidden bg-neon-yellow/10 border-b border-neon-yellow/20 backdrop-blur-md py-3 relative group cursor-default">
        <div className="absolute inset-0 bg-neon-yellow/5 pointer-events-none" />
        
        {/* Label */}
        <div className="absolute left-0 top-0 bottom-0 z-10 bg-black/95 px-6 flex items-center border-r border-neon-yellow/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
            <span className="font-mono font-bold text-neon-yellow tracking-widest text-xs uppercase hidden md:inline">Upcoming Feed</span>
            <span className="font-mono font-bold text-neon-yellow tracking-widest text-xs uppercase md:hidden">Feed</span>
          </div>
        </div>

        <div className="flex animate-[scroll_60s_linear_infinite] group-hover:[animation-play-state:paused] pl-32">
          {displayHolidays.slice(1).map((h, i) => (
            <div 
              key={`${h.countryCode}-${i}`}
              className="flex-shrink-0 flex items-center gap-3 px-6 border-r border-white/5 min-w-[250px]"
            >
              <div className="text-xl grayscale group-hover:grayscale-0 transition-all">{h.emoji}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase text-xs">{h.country}</span>
                  <span className="text-[10px] bg-white/10 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                    {new Date(h.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                  </span>
                </div>
                <div className="text-neon-yellow text-xs font-mono truncate max-w-[180px]">
                  {h.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  )
}
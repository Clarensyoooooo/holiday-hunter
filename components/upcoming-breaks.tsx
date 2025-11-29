{
type: uploaded file
fileName: clarensyoooooo/holiday-hunter/holiday-hunter-0ea04c69fdc93da5ab65e48f8536cb698402f9d0/components/upcoming-breaks.tsx
fullContent:
"use client"

import { useEffect, useRef } from "react"
import type { UpcomingHoliday } from "@/lib/types"

interface UpcomingBreaksProps {
  holidays: UpcomingHoliday[]
}

export function UpcomingBreaks({ holidays }: UpcomingBreaksProps) {
  // Infinite scroll effect duplication
  const displayHolidays = [...holidays, ...holidays, ...holidays]

  return (
    <div className="w-full overflow-hidden bg-neon-yellow/10 border-y border-neon-yellow/20 backdrop-blur-md py-4 relative group cursor-default">
      <div className="absolute inset-0 bg-neon-yellow/5 pointer-events-none" />
      
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-black/90 px-6 flex items-center border-r border-neon-yellow/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
          <span className="font-mono font-bold text-neon-yellow tracking-widest text-sm uppercase">Live Feed</span>
        </div>
      </div>

      <div className="flex animate-[scroll_40s_linear_infinite] group-hover:[animation-play-state:paused] pl-32">
        {displayHolidays.map((h, i) => (
          <div 
            key={`${h.countryCode}-${i}`}
            className="flex-shrink-0 flex items-center gap-4 px-8 border-r border-white/5 min-w-[300px]"
          >
            <div className="text-2xl">{h.emoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase text-sm">{h.country}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  h.daysUntil === 0 
                    ? "bg-neon-pink text-black font-bold animate-pulse" 
                    : "bg-white/10 text-muted-foreground"
                }`}>
                  {h.daysUntil === 0 ? "NOW" : `IN ${h.daysUntil}D`}
                </span>
              </div>
              <div className="text-neon-yellow text-xs font-mono truncate max-w-[200px]">
                {h.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
}
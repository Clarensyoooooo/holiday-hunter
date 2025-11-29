{
type: uploaded file
fileName: clarensyoooooo/holiday-hunter/holiday-hunter-0ea04c69fdc93da5ab65e48f8536cb698402f9d0/components/global-stats.tsx
fullContent:
"use client"

import { Trophy, Calendar, Globe, Sparkles, Crown, Beer } from "lucide-react"
import type { CountryHolidays, MonthStats } from "@/lib/types"

interface GlobalStatsProps {
  totalHolidays: number
  countriesCount: number
  topCountry: CountryHolidays
  partyMonth: MonthStats
}

export function GlobalStats({ totalHolidays, countriesCount, topCountry, partyMonth }: GlobalStatsProps) {
  if (!topCountry) return null

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
        
        {/* Large Bento Item: Top Country */}
        <div className="col-span-1 md:col-span-2 row-span-2 glass-card-maximal rounded-[2rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group hover:border-neon-yellow/50 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-yellow/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-yellow/30 transition-colors" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-yellow/10 text-neon-yellow text-xs font-mono uppercase tracking-widest border border-neon-yellow/20 mb-6">
              <Crown className="w-3 h-3" /> Current Champion
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-white leading-none mb-2">
              {topCountry.name}
            </h3>
            <p className="text-xl text-muted-foreground font-light">The laziest place on Earth 🌍</p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="text-[8rem] md:text-[10rem] leading-none select-none opacity-20 absolute -bottom-10 -right-10 grayscale group-hover:grayscale-0 transition-all duration-700">
              {topCountry.emoji}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-8xl font-black text-neon-yellow">{topCountry.holidayCount}</span>
              <span className="text-xl md:text-2xl font-bold text-white uppercase">Days Off</span>
            </div>
          </div>
        </div>

        {/* Medium Item: Party Month */}
        <div className="col-span-1 md:col-span-2 glass-card-maximal rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group hover:border-neon-pink/50 transition-colors duration-500">
           <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div>
             <div className="flex items-center gap-2 text-neon-pink font-mono text-xs uppercase tracking-widest mb-2">
               <Beer className="w-4 h-4" /> Party Season
             </div>
             <div className="text-4xl md:text-5xl font-black text-white">{partyMonth.month}</div>
             <div className="text-muted-foreground">{partyMonth.count} holidays worldwide</div>
           </div>
           <div className="text-6xl animate-bounce">🎉</div>
        </div>

        {/* Small Item: Avg */}
        <div className="col-span-1 glass-card-maximal rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group hover:border-neon-cyan/50 transition-colors duration-500">
           <Globe className="w-8 h-8 text-neon-cyan mb-4" />
           <div className="text-4xl font-black text-white">
             {Math.round(totalHolidays / countriesCount)}
           </div>
           <div className="text-sm font-mono text-neon-cyan uppercase mt-1">Avg Days / Country</div>
        </div>

        {/* Small Item: Total */}
        <div className="col-span-1 glass-card-maximal rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group hover:border-neon-orange/50 transition-colors duration-500">
           <Sparkles className="w-8 h-8 text-neon-orange mb-4" />
           <div className="text-4xl font-black text-white">
             {totalHolidays}
           </div>
           <div className="text-sm font-mono text-neon-orange uppercase mt-1">Total Celebrations</div>
        </div>

      </div>
    </section>
  )
}
}
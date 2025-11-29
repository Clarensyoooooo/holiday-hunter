"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./hero-section"
import { LazynessLeaderboard } from "./laziness-leaderboard"
import { UpcomingBreaks } from "./upcoming-breaks"
import { GlobalStats } from "./global-stats"
import { FloatingElements } from "./floating-elements"
import { WorldMap } from "./world-map"
import type { CountryHolidays, MonthStats, UpcomingHoliday } from "@/lib/types"

// Default fallback if API fails
const FALLBACK_COUNTRIES = [
  { countryCode: "US", name: "United States" },
  { countryCode: "GB", name: "United Kingdom" },
]

export default function HolidayHunter() {
  const [leaderboard, setLeaderboard] = useState<CountryHolidays[]>([])
  const [monthStats, setMonthStats] = useState<MonthStats[]>([])
  const [upcomingHolidays, setUpcomingHolidays] = useState<UpcomingHoliday[]>([])
  const [totalHolidays, setTotalHolidays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing...")

  useEffect(() => {
    startTheHunt()
  }, [])

  const startTheHunt = async () => {
    const year = new Date().getFullYear()
    
    try {
      setLoadingText("Discovering countries...")
      const countriesRes = await fetch("https://date.nager.at/api/v3/AvailableCountries")
      
      let targetCountries = FALLBACK_COUNTRIES
      if (countriesRes.ok) {
        targetCountries = await countriesRes.json()
      }

      const BATCH_SIZE = 5
      const results = []
      
      for (let i = 0; i < targetCountries.length; i += BATCH_SIZE) {
        const batch = targetCountries.slice(i, i + BATCH_SIZE)
        const progress = Math.round((i / targetCountries.length) * 100)
        setLoadingProgress(progress)
        setLoadingText(`Scanning ${batch[0].name}...`)

        const batchPromises = batch.map(async (c: any) => {
          try {
            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${c.countryCode}`)
            if (!res.ok) return null
            const text = await res.text()
            if (!text) return null
            const data = JSON.parse(text)

            const realHolidays = data.filter((h: any) => {
              const date = new Date(h.date)
              const dayOfWeek = date.getDay()
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
              return h.global && !isWeekend
            })

            return {
              country: { 
                code: c.countryCode, 
                name: c.name,
                emoji: getFlagEmoji(c.countryCode) 
              },
              rawHolidays: data,
              count: realHolidays.length
            }
          } catch (e) {
            return null
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults.filter(Boolean))
        await new Promise(r => setTimeout(r, 50))
      }

      const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null)

      const countryHolidays: CountryHolidays[] = validResults.map(r => ({
        code: r.country.code,
        name: r.country.name,
        emoji: r.country.emoji,
        holidayCount: r.count,
        holidays: r.rawHolidays
      }))
      countryHolidays.sort((a, b) => b.holidayCount - a.holidayCount)
      setLeaderboard(countryHolidays)

      const allHolidays = validResults.flatMap(r => 
        r.rawHolidays.map((h: any) => ({
          date: h.date,
          name: h.name,
          country: r.country.name,
          countryCode: r.country.code
        }))
      )
      setTotalHolidays(allHolidays.length)

      const monthCounts: Record<number, number> = {}
      allHolidays.forEach((h) => {
        const month = new Date(h.date).getMonth()
        monthCounts[month] = (monthCounts[month] || 0) + 1
      })
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const stats: MonthStats[] = months.map((name, index) => ({
        month: name,
        count: monthCounts[index] || 0,
        index,
      }))
      setMonthStats(stats)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcoming = allHolidays
        .filter((h) => new Date(h.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 20) // Get more for the ticker
        .map((h) => ({
          ...h,
          daysUntil: Math.ceil((new Date(h.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
          emoji: getFlagEmoji(h.countryCode)
        }))
      setUpcomingHolidays(upcoming)

      setLoading(false)

    } catch (error) {
      console.error("Hunt failed:", error)
      setLoading(false)
    }
  }

  function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <div className="bg-grain" />
        <FloatingElements />
        
        {/* Loading Spinner Overhaul */}
        <div className="relative z-10 w-full max-w-md p-8 glass-card-maximal rounded-3xl text-center">
          <div className="text-8xl mb-8 animate-bounce inline-block filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            🌍
          </div>
          <h2 className="text-4xl font-black mb-4 text-gradient-maximal tracking-tighter">
            HUNTING HOLIDAYS
          </h2>
          <p className="text-neon-cyan font-mono mb-8 animate-pulse">
            {loadingText}
          </p>
          
          <div className="relative w-full h-6 bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-yellow transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[move-stripes_1s_linear_infinite]" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
            <span>START</span>
            <span>{loadingProgress}%</span>
            <span>FINISH</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative selection:bg-neon-pink selection:text-white">
      <div className="bg-grain" />
      <FloatingElements />
      
      {/* Massive Gradient Orb Backgrounds */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-float" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-neon-cyan/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <main className="relative z-10 flex flex-col gap-12 pb-32">
        <HeroSection totalHolidays={totalHolidays} countriesCount={leaderboard.length} />
        
        {/* SECTION 1: WORLD MAP (Now at the top) */}
        <div className="w-full relative z-20">
           <WorldMap data={leaderboard} />
        </div>

        {/* Ticker Tape */}
        <UpcomingBreaks holidays={upcomingHolidays} />

        <div className="container mx-auto px-4 space-y-24">
          <GlobalStats
            totalHolidays={totalHolidays}
            countriesCount={leaderboard.length}
            topCountry={leaderboard[0]}
            partyMonth={monthStats.reduce((a, b) => (a.count > b.count ? a : b), { month: "", count: 0, index: 0 })}
          />
          
          <div className="w-full max-w-5xl mx-auto">
            <LazynessLeaderboard leaderboard={leaderboard} />
          </div>
        </div>
      </main>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./hero-section"
import { LazynessLeaderboard } from "./laziness-leaderboard"
import { PartyMonth } from "./party-month"
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
      // 1. Get the list of ALL available countries from the API
      setLoadingText("Discovering countries...")
      const countriesRes = await fetch("https://date.nager.at/api/v3/AvailableCountries")
      
      let targetCountries = FALLBACK_COUNTRIES
      if (countriesRes.ok) {
        targetCountries = await countriesRes.json()
      }

      // 2. Fetch holidays in BATCHES to avoid rate limits/crashes
      // We process 5 countries at a time
      const BATCH_SIZE = 5
      const results = []
      
      for (let i = 0; i < targetCountries.length; i += BATCH_SIZE) {
        const batch = targetCountries.slice(i, i + BATCH_SIZE)
        
        // Update UI
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

            // Logic: Filter mostly for weekdays to determine "Laziness" score
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
                // Simple emoji map based on code (optional polish: use a library for flags)
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
        
        // Small breather to be nice to the API
        await new Promise(r => setTimeout(r, 50))
      }

      // 3. Process All Data
      const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null)

      // Leaderboard
      const countryHolidays: CountryHolidays[] = validResults.map(r => ({
        code: r.country.code,
        name: r.country.name,
        emoji: r.country.emoji,
        holidayCount: r.count,
        holidays: r.rawHolidays
      }))
      countryHolidays.sort((a, b) => b.holidayCount - a.holidayCount)
      setLeaderboard(countryHolidays)

      // Flatten for analytics
      const allHolidays = validResults.flatMap(r => 
        r.rawHolidays.map((h: any) => ({
          date: h.date,
          name: h.name,
          country: r.country.name,
          countryCode: r.country.code
        }))
      )
      setTotalHolidays(allHolidays.length)

      // Party Month Stats
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

      // Upcoming Breaks
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcoming = allHolidays
        .filter((h) => new Date(h.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
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

  // Helper to get flag emoji from country code
  function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <FloatingElements />
        <div className="relative z-10 text-center max-w-md w-full">
          <div className="text-6xl mb-6 animate-bounce">🌍</div>
          <h2 className="text-2xl font-bold mb-2 gradient-text">Hunting Holidays...</h2>
          <p className="text-muted-foreground mb-6 h-6">{loadingText}</p>
          
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-tropical-orange to-tropical-yellow transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-right">{loadingProgress}% scanned</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10">
        <HeroSection totalHolidays={totalHolidays} countriesCount={leaderboard.length} />
        
        {/* World Map Section */}
        <WorldMap data={leaderboard} />
        
        <GlobalStats
          totalHolidays={totalHolidays}
          countriesCount={leaderboard.length}
          topCountry={leaderboard[0]}
          partyMonth={monthStats.reduce((a, b) => (a.count > b.count ? a : b), { month: "", count: 0, index: 0 })}
        />
        <LazynessLeaderboard leaderboard={leaderboard} />
        <PartyMonth monthStats={monthStats} />
        <UpcomingBreaks holidays={upcomingHolidays} />
      </div>
    </div>
  )
}
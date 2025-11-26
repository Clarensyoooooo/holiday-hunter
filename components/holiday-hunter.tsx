"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./hero-section"
import { LazynessLeaderboard } from "./laziness-leaderboard"
import { PartyMonth } from "./party-month"
import { UpcomingBreaks } from "./upcoming-breaks"
import { GlobalStats } from "./global-stats"
import { FloatingElements } from "./floating-elements"
import { WorldMap } from "./world-map" // <--- Make sure this import exists!
import type { CountryHolidays, MonthStats, UpcomingHoliday } from "@/lib/types"

const COUNTRIES = [
  { code: "US", name: "United States", emoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", emoji: "🇬🇧" },
  { code: "DE", name: "Germany", emoji: "🇩🇪" },
  { code: "FR", name: "France", emoji: "🇫🇷" },
  { code: "JP", name: "Japan", emoji: "🇯🇵" },
  { code: "CA", name: "Canada", emoji: "🇨🇦" },
  { code: "AU", name: "Australia", emoji: "🇦🇺" },
  { code: "BR", name: "Brazil", emoji: "🇧🇷" },
  { code: "IN", name: "India", emoji: "🇮🇳" },
  { code: "MX", name: "Mexico", emoji: "🇲🇽" },
  { code: "IT", name: "Italy", emoji: "🇮🇹" },
  { code: "ES", name: "Spain", emoji: "🇪🇸" },
  { code: "NL", name: "Netherlands", emoji: "🇳🇱" },
  { code: "PL", name: "Poland", emoji: "🇵🇱" },
  { code: "SE", name: "Sweden", emoji: "🇸🇪" },
]

export default function HolidayHunter() {
  const [leaderboard, setLeaderboard] = useState<CountryHolidays[]>([])
  const [monthStats, setMonthStats] = useState<MonthStats[]>([])
  const [upcomingHolidays, setUpcomingHolidays] = useState<UpcomingHoliday[]>([])
  const [totalHolidays, setTotalHolidays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    fetchAllHolidays()
  }, [])

  const fetchAllHolidays = async () => {
    const year = new Date().getFullYear()
    
    // 1. Fetch all countries in parallel 🚀
    const holidayPromises = COUNTRIES.map(async (country, i) => {
      // Update progress bar as we start requests
      setLoadingProgress(Math.round(((i + 1) / COUNTRIES.length) * 100))

      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country.code}`)
        
        // Safety check: Avoid "Unexpected end of JSON" error
        if (!res.ok) return null
        const text = await res.text() 
        if (!text) return null 

        const data = JSON.parse(text)
        
        // Filter for "Real" Days Off (Weekdays only)
        const realHolidays = data.filter((h: any) => {
          const date = new Date(h.date)
          const dayOfWeek = date.getDay() // 0 = Sun, 6 = Sat
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          return h.global && !isWeekend 
        })

        return {
          country,
          rawHolidays: data,
          count: realHolidays.length
        }
      } catch (e) {
        console.warn(`Failed to fetch for ${country.name}`, e)
        return null
      }
    })

    const results = await Promise.all(holidayPromises)
    const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null)

    // 2. Re-create the Leaderboard
    const countryHolidays: CountryHolidays[] = validResults.map(r => ({
      code: r.country.code,
      name: r.country.name,
      emoji: r.country.emoji,
      holidayCount: r.count,
      holidays: r.rawHolidays
    }))

    // Sort leaderboard
    countryHolidays.sort((a, b) => b.holidayCount - a.holidayCount)
    setLeaderboard(countryHolidays)

    // 3. Flatten list for analytics
    const allHolidays = validResults.flatMap(r => 
      r.rawHolidays.map((h: any) => ({
        date: h.date,
        name: h.name,
        country: r.country.name,
        countryCode: r.country.code
      }))
    )

    setTotalHolidays(allHolidays.length)

    // 4. Calculate Month Stats
    const monthCounts: Record<number, number> = {}
    allHolidays.forEach((h) => {
      const month = new Date(h.date).getMonth()
      monthCounts[month] = (monthCounts[month] || 0) + 1
    })

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]
    
    const stats: MonthStats[] = months.map((name, index) => ({
      month: name,
      count: monthCounts[index] || 0,
      index,
    }))
    setMonthStats(stats)

    // 5. Calculate Upcoming Breaks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const upcoming = allHolidays
      .filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
      .map((h) => ({
        ...h,
        daysUntil: Math.ceil((new Date(h.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        emoji: COUNTRIES.find((c) => c.code === h.countryCode)?.emoji || "🎉",
      }))
      
    setUpcomingHolidays(upcoming)
    setLoading(false)
  }

  // --- This was likely the part that got messed up! ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <FloatingElements />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6 animate-bounce">🏖️</div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Hunting Holidays Around the World...</h2>
          <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tropical-orange to-tropical-yellow transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-3">{loadingProgress}% complete</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10">
        <HeroSection totalHolidays={totalHolidays} countriesCount={COUNTRIES.length} />
        
        {/* World Map Section */}
        <WorldMap data={leaderboard} />
        
        <GlobalStats
          totalHolidays={totalHolidays}
          countriesCount={COUNTRIES.length}
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
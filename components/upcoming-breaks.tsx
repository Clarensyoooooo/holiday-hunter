"use client"

import { useState, useEffect } from "react"
import { Clock, Sparkles, PartyPopper } from "lucide-react" // Added PartyPopper
import type { UpcomingHoliday } from "@/lib/types"

interface UpcomingBreaksProps {
  holidays: UpcomingHoliday[]
}

export function UpcomingBreaks({ holidays }: UpcomingBreaksProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const nextHoliday = holidays[0]

  const getTimeUntil = (dateStr: string) => {
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    const diff = target.getTime() - now.getTime()

    // If diff is negative but it's the same day, it's TODAY!
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
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* ... Header code stays same ... */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tropical-cyan/10 text-tropical-cyan text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Countdown
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Upcoming</span> Breaks
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your next day off is closer than you think. Start planning!
          </p>
        </div>

        {/* Main Countdown */}
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tropical-cyan/10 via-transparent to-tropical-orange/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">{nextHoliday.emoji}</span>
              <Sparkles className="w-6 h-6 text-tropical-yellow animate-pulse" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{nextHoliday.name}</h3>
            <p className="text-muted-foreground mb-8">
              {nextHoliday.country} •{" "}
              {new Date(nextHoliday.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* UPDATED TIMER LOGIC */}
            {countdown.isToday ? (
              <div className="animate-bounce">
                <div className="inline-block bg-tropical-pink text-white px-8 py-4 rounded-full text-2xl md:text-4xl font-black shadow-xl">
                  <PartyPopper className="inline-block w-8 h-8 mr-2 -mt-1" />
                  HAPPENING TODAY!
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hours" },
                  { value: countdown.minutes, label: "Minutes" },
                  { value: countdown.seconds, label: "Seconds" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="glass-card rounded-2xl p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                      <span className="text-3xl md:text-5xl font-black gradient-text">
                        {item.value.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ... List code stays same ... */}
        <div className="grid gap-3">
          {holidays.slice(1).map((holiday, index) => (
            <div
              key={`${holiday.date}-${holiday.country}`}
              className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <span className="text-3xl">{holiday.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{holiday.name}</p>
                <p className="text-sm text-muted-foreground">{holiday.country}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-tropical-cyan font-bold">
                  {holiday.daysUntil === 0 ? "Today!" : `${holiday.daysUntil}d`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(holiday.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
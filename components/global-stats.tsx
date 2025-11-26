"use client"

import { Trophy, Calendar, Globe, Sparkles } from "lucide-react"
import type { CountryHolidays, MonthStats } from "@/lib/types"

interface GlobalStatsProps {
  totalHolidays: number
  countriesCount: number
  topCountry: CountryHolidays
  partyMonth: MonthStats
}

export function GlobalStats({ totalHolidays, countriesCount, topCountry, partyMonth }: GlobalStatsProps) {
  const stats = [
    {
      icon: Globe,
      label: "Total Holidays",
      value: totalHolidays,
      color: "text-tropical-cyan",
      bgColor: "bg-tropical-cyan/10",
    },
    {
      icon: Trophy,
      label: "Top Country",
      value: `${topCountry.emoji} ${topCountry.name}`,
      subValue: `${topCountry.holidayCount} days off`,
      color: "text-tropical-orange",
      bgColor: "bg-tropical-orange/10",
    },
    {
      icon: Calendar,
      label: "Party Month",
      value: partyMonth.month,
      subValue: `${partyMonth.count} holidays`,
      color: "text-tropical-pink",
      bgColor: "bg-tropical-pink/10",
    },
    {
      icon: Sparkles,
      label: "Countries Analyzed",
      value: countriesCount,
      color: "text-tropical-yellow",
      bgColor: "bg-tropical-yellow/10",
    },
  ]

  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              {stat.subValue && <p className={`text-sm ${stat.color} mt-1`}>{stat.subValue}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { PartyPopper } from "lucide-react"
import type { MonthStats } from "@/lib/types"

interface PartyMonthProps {
  monthStats: MonthStats[]
}

const COLORS = [
  "#22d3ee", // cyan
  "#22c55e", // green
  "#f97316", // orange
  "#ec4899", // pink
  "#facc15", // yellow
  "#22d3ee",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#facc15",
  "#22d3ee",
  "#22c55e",
]

export function PartyMonth({ monthStats }: PartyMonthProps) {
  const maxCount = Math.max(...monthStats.map((m) => m.count))
  const partyMonth = monthStats.find((m) => m.count === maxCount)

  const chartData = monthStats.map((m) => ({
    name: m.month.slice(0, 3),
    fullName: m.month,
    count: m.count,
    isMax: m.count === maxCount,
  }))

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-transparent via-tropical-pink/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tropical-pink/10 text-tropical-pink text-sm font-medium mb-4">
            <PartyPopper className="w-4 h-4" />
            Global Analysis
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            The <span className="gradient-text">Party</span> Month
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            When does the world celebrate the most? Discover the ultimate party month!
          </p>
        </div>

        {/* Winner Card */}
        {partyMonth && (
          <div className="glass-card rounded-3xl p-8 mb-8 text-center animate-pulse-glow">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-black gradient-text mb-2">{partyMonth.month}</h3>
            <p className="text-muted-foreground">
              wins with <span className="text-tropical-pink font-bold">{partyMonth.count} holidays</span> worldwide!
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h4 className="font-semibold mb-6 text-foreground">Holidays by Month</h4>
          <div className="h-64 md:h-80 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="glass-card rounded-xl p-3 border border-border">
                          <p className="font-semibold text-foreground">{data.fullName}</p>
                          <p className="text-tropical-cyan">{data.count} holidays</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isMax ? "#ec4899" : COLORS[index % COLORS.length]}
                      opacity={entry.isMax ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          {monthStats.map((month, index) => (
            <div
              key={month.month}
              className={`glass-card rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 ${
                month.count === maxCount ? "ring-2 ring-tropical-pink" : ""
              }`}
            >
              <p className="text-2xl mb-1">
                {["❄️", "💝", "🌸", "🌷", "🌻", "☀️", "🏖️", "🌅", "🍂", "🎃", "🦃", "🎄"][index]}
              </p>
              <p className="text-xs text-muted-foreground">{month.month.slice(0, 3)}</p>
              <p className="font-bold text-foreground" style={{ color: COLORS[index] }}>
                {month.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
  "#22d3ee", "#22c55e", "#f97316", "#ec4899", "#facc15", "#22d3ee", "#22c55e",
]

export function PartyMonth({ monthStats }: PartyMonthProps) {
  const maxCount = Math.max(...monthStats.map((m) => m.count))

  return (
    <div className="glass-card-maximal rounded-[2rem] p-8 relative overflow-hidden group">
      {/* Animated Holographic Background */}
      <div className="absolute -inset-[50%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:animate-spotlight opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-white uppercase flex items-center gap-2">
            <span className="p-2 bg-neon-pink/20 rounded-lg text-neon-pink"><PartyPopper className="w-6 h-6" /></span>
            Rhythm of the Year
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthStats}>
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/90 border border-neon-pink/50 p-3 rounded-xl shadow-2xl">
                        <p className="font-bold text-white mb-1">{payload[0].payload.month}</p>
                        <p className="text-neon-pink font-mono">{payload[0].value} Days Off</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {monthStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count === maxCount ? "oklch(0.7 0.3 340)" : "rgba(255,255,255,0.1)"}
                    className="transition-all duration-300 hover:opacity-100"
                    style={{
                      filter: entry.count === maxCount ? "drop-shadow(0 0 10px oklch(0.7 0.3 340))" : "none"
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
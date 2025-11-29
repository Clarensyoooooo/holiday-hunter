{
type: uploaded file
fileName: clarensyoooooo/holiday-hunter/holiday-hunter-0ea04c69fdc93da5ab65e48f8536cb698402f9d0/components/hero-section.tsx
fullContent:
"use client"

import { Palmtree, Sun, Plane, Star } from "lucide-react"

interface HeroSectionProps {
  totalHolidays: number
  countriesCount: number
}

export function HeroSection({ totalHolidays, countriesCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden perspective-1000">
      
      {/* Giant Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5">
        <span className="text-[20vw] font-black text-white leading-none whitespace-nowrap animate-pulse">
          HOLIDAY
        </span>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 backdrop-blur-md text-neon-cyan font-mono text-sm tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-in fade-in zoom-in duration-1000">
          <Star className="w-4 h-4 animate-spin-slow" />
          The Ultimate Global Tracker
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
          <div className="text-white drop-shadow-2xl">HOLIDAY</div>
          <div className="text-gradient-maximal drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
            HUNTER
          </div>
        </h1>

        <p className="text-xl md:text-3xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
          We scanned <span className="text-white font-bold">{countriesCount} countries</span> to find <span className="text-white font-bold">{totalHolidays} reasons</span> for you to not work today.
        </p>

        {/* 3D Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full">
          {[
            { icon: Palmtree, color: "text-neon-green", label: "Global Breaks", value: totalHolidays, bg: "bg-neon-green/10", border: "border-neon-green/20" },
            { icon: Plane, color: "text-neon-cyan", label: "Countries Scanned", value: countriesCount, bg: "bg-neon-cyan/10", border: "border-neon-cyan/20" },
            { icon: Sun, color: "text-neon-yellow", label: "Live Updates", value: "24/7", bg: "bg-neon-yellow/10", border: "border-neon-yellow/20" },
          ].map((item, i) => (
            <div 
              key={i}
              className={`group relative glass-card-maximal p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 ${item.border}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent rounded-3xl`} />
              <item.icon className={`w-12 h-12 ${item.color} mb-4 stroke-[1.5px]`} />
              <div className="text-4xl font-black text-white mb-1">{item.value}</div>
              <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
}
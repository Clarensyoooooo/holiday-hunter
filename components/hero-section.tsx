"use client"

import { Palmtree, Sun, Plane } from "lucide-react"

interface HeroSectionProps {
  totalHolidays: number
  countriesCount: number
}

export function HeroSection({ totalHolidays, countriesCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tropical-orange/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tropical-cyan/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-tropical-pink/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Floating icons */}
        <div className="flex justify-center gap-4 mb-6">
          <span className="text-5xl animate-float" style={{ animationDelay: "0s" }}>
            🌴
          </span>
          <span className="text-5xl animate-float" style={{ animationDelay: "0.5s" }}>
            ☀️
          </span>
          <span className="text-5xl animate-float" style={{ animationDelay: "1s" }}>
            🏖️
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
          <span className="gradient-text">Holiday</span>
          <br />
          <span className="text-foreground">Hunter</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover which country has the most days off, find the best month to party, and count down to your next break!
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-tropical-green" />
            <span>{totalHolidays} holidays tracked</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2">
            <Plane className="w-5 h-5 text-tropical-cyan" />
            <span>{countriesCount} countries analyzed</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2">
            <Sun className="w-5 h-5 text-tropical-yellow" />
            <span>Real-time data</span>
          </div>
        </div>
      </div>
    </section>
  )
}

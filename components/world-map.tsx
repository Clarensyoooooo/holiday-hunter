"use client"

import { useState, useMemo } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet" // Removed unused imports
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, MapPin } from "lucide-react"
import type { CountryHolidays } from "@/lib/types"

// 1. Use the reliable standard map 🌍
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// 2. Dictionary to fix name mismatches
const NAME_FIXES: Record<string, string> = {
  "United States of America": "United States",
  "South Korea": "South Korea",
  "Dem. Rep. Congo": "Congo, Democratic Republic of the",
  "Central African Rep.": "Central African Republic",
  "Eq. Guinea": "Equatorial Guinea",
  "Solomon Is.": "Solomon Islands",
  "Dominican Rep.": "Dominican Republic",
  "Bosnia and Herz.": "Bosnia and Herzegovina"
}

interface WorldMapProps {
  data: CountryHolidays[]
}

export function WorldMap({ data }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryHolidays | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")

  const dataMap = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => {
      map[d.name] = d.holidayCount
    })
    return map
  }, [data])

  const maxHolidays = Math.max(...data.map(d => d.holidayCount)) || 1

  const colorScale = scaleLinear<string>()
    .domain([0, maxHolidays])
    .range(["#ffedd5", "#ec4899"])

  const getCountryData = (geo: any) => {
    const mapName = geo.properties.name
    const apiName = NAME_FIXES[mapName] || mapName
    return data.find(c => c.name === apiName)
  }

  // Helper to find the "Next" holiday index
  const getNextHolidayIndex = (holidays: any[]) => {
    const now = new Date()
    return holidays.findIndex(h => new Date(h.date) >= now)
  }

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-transparent to-tropical-cyan/5">
      <div className="max-w-6xl mx-auto text-center mb-8">
         <h2 className="text-4xl font-black mb-4">
            <span className="gradient-text">Global</span> Holiday Map
          </h2>
          <p className="text-muted-foreground">
            Click on any highlighted country to see their upcoming breaks.
          </p>
      </div>

      <div className="glass-card rounded-3xl p-4 md:p-8 overflow-hidden relative min-h-[500px] flex items-center justify-center bg-black/20">
        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = getCountryData(geo)
                  const count = countryData?.holidayCount
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        if (countryData) setSelectedCountry(countryData)
                      }}
                      onMouseEnter={() => {
                        if (count) setTooltipContent(`${countryData.name}: ${count} holidays`)
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{
                        default: {
                          fill: count ? colorScale(count) : "#3f3f46", 
                          outline: "none",
                          stroke: "rgba(255,255,255,0.1)",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: count ? "#facc15" : "#52525b", 
                          outline: "none",
                          cursor: count ? "pointer" : "default",
                        },
                        pressed: {
                          fill: "#f97316",
                          outline: "none",
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full text-sm font-bold animate-in fade-in zoom-in pointer-events-none z-20">
             {tooltipContent}
           </div>
        )}
      </div>

      {/* SIDEBAR START */}
      <Sheet open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 border-l border-white/10 bg-background/95 backdrop-blur-xl">
          {selectedCountry && (
            <div className="flex flex-col h-full">
              {/* 1. Header (Fixed Height: 12rem / 192px) */}
              <div className="relative h-48 shrink-0 bg-gradient-to-br from-tropical-cyan/20 via-background to-tropical-pink/20 p-6 flex flex-col justify-end border-b border-white/5">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl grayscale pointer-events-none select-none">
                    {selectedCountry.emoji}
                </div>
                <div className="relative z-10">
                    <span className="text-5xl mb-2 block shadow-sm">{selectedCountry.emoji}</span>
                    <SheetTitle className="text-3xl font-black tracking-tight text-white">
                        {selectedCountry.name}
                    </SheetTitle>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80">
                            <MapPin className="w-3 h-3" />
                            {selectedCountry.code}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tropical-orange/20 border border-tropical-orange/20 text-xs font-medium text-tropical-orange">
                            <Calendar className="w-3 h-3" />
                            {selectedCountry.holidayCount} Holidays
                        </div>
                    </div>
                </div>
              </div>
              
              {/* 2. List (Calculated Height: 100vh - Header) */}
              <ScrollArea className="h-[calc(100vh-12rem)] p-6">
                <div className="relative border-l border-white/10 ml-3 space-y-8 pb-20"> {/* Added pb-20 for bottom padding */}
                  {selectedCountry.holidays.map((h, i) => {
                    const date = new Date(h.date)
                    const now = new Date()
                    now.setHours(0,0,0,0)
                    
                    const isPast = date < now
                    const isNext = i === getNextHolidayIndex(selectedCountry.holidays)
                    
                    return (
                      <div key={i} className={`relative pl-8 transition-all duration-500 ${isPast ? "opacity-40 grayscale" : "opacity-100"}`}>
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-background ${
                            isNext ? "bg-tropical-yellow ring-4 ring-tropical-yellow/20 scale-125 animate-pulse" 
                            : isPast ? "bg-muted-foreground" 
                            : "bg-tropical-cyan"
                        }`} />
                        
                        {/* Card */}
                        <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                            isNext 
                            ? "bg-gradient-to-r from-tropical-yellow/10 to-transparent border-tropical-yellow/30" 
                            : "bg-card/50 border-white/5"
                        }`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold tracking-wider uppercase ${
                                    isNext ? "text-tropical-yellow" : "text-muted-foreground"
                                }`}>
                                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                </span>
                                {isPast && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">PASSED</span>}
                                {isNext && <span className="text-[10px] bg-tropical-yellow/20 text-tropical-yellow px-2 py-0.5 rounded-full animate-pulse">UP NEXT</span>}
                            </div>
                            <h4 className="text-lg font-bold leading-tight mb-1 text-foreground">
                                {h.localName || h.name}
                            </h4>
                            {h.localName && h.localName !== h.name && (
                                <p className="text-sm text-muted-foreground italic">{h.name}</p>
                            )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  )
}
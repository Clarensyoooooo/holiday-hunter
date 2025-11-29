"use client"

import { useState, useMemo, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, MapPin, Globe } from "lucide-react"
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
  const [rotation, setRotation] = useState<[number, number, number]>([0, -10, 0])
  const [isHovering, setIsHovering] = useState(false)

  // 3D Rotation Animation
  useEffect(() => {
    let requestID: number;
    const animate = () => {
      if (!isHovering && !selectedCountry) {
        setRotation((r) => [r[0] - 0.15, r[1], r[2]]) // Smooth slow spin
      }
      requestID = requestAnimationFrame(animate);
    };
    requestID = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestID);
  }, [isHovering, selectedCountry]);

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
    .range(["#27272a", "#ec4899"]) // Dark gray to Neon Pink

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
    <section className="px-4 py-24 relative z-10 overflow-visible">
       <div className="max-w-6xl mx-auto text-center mb-16">
         <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-sm tracking-widest uppercase mb-4 animate-pulse">
            <Globe className="w-4 h-4" /> Global View
         </div>
         <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient-xy">Holographic</span> World
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Spin the globe to explore holiday data. Hover to pause. Click to view details.
          </p>
      </div>

      <div 
        className="flex justify-center relative perspective-1000"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Glow behind the globe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />

        <div className="w-full max-w-[800px] aspect-square relative cursor-grab active:cursor-grabbing">
            <ComposableMap 
              projection="geoOrthographic" 
              projectionConfig={{ scale: 350, rotate: rotation }}
              height={800}
              width={800}
            >
              {/* "Ocean" background and Atmosphere */}
              <Sphere stroke="transparent" strokeWidth={0} fill="rgba(0,0,0,0.4)" id="rsm-sphere" />
              <Graticule stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
              
              {/* Outer Glow Ring using stroke on a second sphere (Hack) */}
              <Sphere stroke="#22d3ee" strokeWidth={1} fill="transparent" id="rsm-atmosphere" style={{ filter: "drop-shadow(0 0 10px #22d3ee)" }} />

              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryData = getCountryData(geo)
                    const count = countryData?.holidayCount
                    const isSelected = selectedCountry?.name === countryData?.name
                    
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
                            fill: count ? colorScale(count) : "#18181b", 
                            outline: "none",
                            stroke: isSelected ? "#facc15" : "rgba(255,255,255,0.05)",
                            strokeWidth: isSelected ? 2 : 0.5,
                            filter: isSelected ? "drop-shadow(0 0 10px #facc15)" : "none",
                            transition: "all 0.3s ease"
                          },
                          hover: {
                            fill: count ? "#facc15" : "#27272a", 
                            outline: "none",
                            stroke: "#facc15",
                            strokeWidth: 1,
                            cursor: count ? "pointer" : "default",
                            filter: "drop-shadow(0 0 15px #facc15)"
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
            </ComposableMap>
        </div>
        
        {/* Futuristic Floating Tooltip */}
        {tooltipContent && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
             <div className="glass-card-maximal px-8 py-4 rounded-full text-white font-bold backdrop-blur-xl border border-neon-cyan/50 shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-in zoom-in fade-in duration-200 flex items-center gap-3">
               <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
               <span className="text-lg tracking-wide">{tooltipContent}</span>
             </div>
           </div>
        )}
      </div>

      {/* SIDEBAR START */}
      <Sheet open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        {/* Force high Z-index to beat the Map canvas */}
        <SheetContent className="w-full sm:max-w-md p-0 border-l border-neon-purple/20 bg-black/90 backdrop-blur-xl shadow-[0_0_100px_rgba(168,85,247,0.2)] z-[100]">
          {selectedCountry && (
            <div className="flex flex-col h-full relative overflow-hidden">
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[80px] rounded-full pointer-events-none" />

              {/* 1. Header */}
              <div className="relative h-48 shrink-0 flex flex-col justify-end p-8 border-b border-white/10 z-10">
                <div className="absolute top-6 right-6 opacity-20 text-8xl grayscale pointer-events-none select-none animate-pulse">
                    {selectedCountry.emoji}
                </div>
                <div className="relative z-10">
                    <span className="text-6xl mb-4 block shadow-sm animate-bounce">{selectedCountry.emoji}</span>
                    <SheetTitle className="text-4xl font-black tracking-tight text-white mb-4">
                        {selectedCountry.name}
                    </SheetTitle>
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 uppercase tracking-wider">
                            <MapPin className="w-3 h-3 text-neon-cyan" />
                            {selectedCountry.code}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-xs font-mono text-neon-pink uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {selectedCountry.holidayCount} Holidays
                        </div>
                    </div>
                </div>
              </div>
              
              {/* 2. List with Proper ScrollArea */}
              <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full w-full p-8">
                  <div className="relative border-l border-white/10 ml-3 space-y-8 pb-20"> 
                    {selectedCountry.holidays.map((h, i) => {
                      const date = new Date(h.date)
                      const now = new Date()
                      now.setHours(0,0,0,0)
                      
                      const isPast = date < now
                      const isNext = i === getNextHolidayIndex(selectedCountry.holidays)
                      
                      return (
                        <div key={i} className={`relative pl-8 transition-all duration-500 group ${isPast ? "opacity-40 hover:opacity-70" : "opacity-100"}`}>
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-black transition-all duration-300 ${
                              isNext ? "bg-neon-yellow ring-4 ring-neon-yellow/20 scale-150 animate-pulse border-none" 
                              : isPast ? "bg-muted-foreground border-muted-foreground" 
                              : "bg-neon-cyan border-neon-cyan group-hover:scale-125 group-hover:shadow-[0_0_10px_#22d3ee]"
                          }`} />
                          
                          {/* Card */}
                          <div className={`p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                              isNext 
                              ? "bg-gradient-to-r from-neon-yellow/10 to-transparent border-neon-yellow/30 shadow-[0_0_30px_-10px_rgba(250,204,21,0.2)]" 
                              : "bg-white/5 border-white/5 group-hover:border-white/20 group-hover:bg-white/10"
                          }`}>
                              <div className="flex justify-between items-start mb-2">
                                  <span className={`text-xs font-bold tracking-widest uppercase font-mono ${
                                      isNext ? "text-neon-yellow" : "text-muted-foreground group-hover:text-white"
                                  }`}>
                                      {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                  </span>
                                  {isPast && <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-muted-foreground">PASSED</span>}
                                  {isNext && <span className="text-[10px] font-mono bg-neon-yellow/20 text-neon-yellow px-2 py-0.5 rounded animate-pulse font-bold">UP NEXT</span>}
                              </div>
                              <h4 className="text-lg font-bold leading-tight mb-1 text-white group-hover:text-neon-cyan transition-colors">
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
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  )
}
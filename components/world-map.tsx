"use client"

import { useState, useMemo } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import { ISO_MAP, REVERSE_ISO_MAP } from "@/lib/country-codes"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CountryHolidays } from "@/lib/types"

// Standard GeoJSON for the world
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
  data: CountryHolidays[]
}

export function WorldMap({ data }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryHolidays | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")

  // Create a dictionary for fast lookups: { "USA": 15, "BRA": 18 }
  const dataMap = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => {
      const iso3 = ISO_MAP[d.code]
      if (iso3) map[iso3] = d.holidayCount
    })
    return map
  }, [data])

  // Color scale: Light Orange -> Hot Pink based on holiday count
  const colorScale = scaleLinear<string>()
    .domain([0, Math.max(...data.map(d => d.holidayCount)) || 1])
    .range(["#ffedd5", "#ec4899"]) // Tailwind colors converted to Hex

  const handleCountryClick = (geo: any) => {
    const iso3 = geo.properties.ISO_A3
    const iso2 = REVERSE_ISO_MAP[iso3]
    if (iso2) {
      const countryData = data.find(c => c.code === iso2)
      if (countryData) setSelectedCountry(countryData)
    }
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

      <div className="glass-card rounded-3xl p-4 md:p-8 overflow-hidden relative min-h-[500px]">
        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso3 = geo.properties.ISO_A3
                  const count = dataMap[iso3]
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={() => {
                        if (count) setTooltipContent(`${geo.properties.NAME}: ${count} holidays`)
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{
                        default: {
                          fill: count ? colorScale(count) : "#e5e7eb", // Gray if no data
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: count ? "#facc15" : "#d1d5db", // Yellow on hover if valid
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
        
        {/* Custom Tooltip */}
        {tooltipContent && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full text-sm font-bold animate-in fade-in zoom-in">
             {tooltipContent}
           </div>
        )}
      </div>

      {/* The Sheet (Sidebar) for details */}
      <Sheet open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-background/95 backdrop-blur-xl border-l border-border">
          {selectedCountry && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-4xl flex items-center gap-3">
                  <span>{selectedCountry.emoji}</span>
                  <span className="gradient-text">{selectedCountry.name}</span>
                </SheetTitle>
                <SheetDescription className="text-lg">
                  Total Holidays: <span className="font-bold text-foreground">{selectedCountry.holidayCount}</span>
                </SheetDescription>
              </SheetHeader>
              
              <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Upcoming & Recent</h4>
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-3">
                  {selectedCountry.holidays.map((h, i) => {
                    const date = new Date(h.date)
                    const isPast = date < new Date()
                    
                    return (
                      <div 
                        key={i} 
                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all hover:scale-[1.01] ${
                          isPast ? 'bg-muted/50 border-transparent opacity-60' : 'bg-card border-tropical-cyan/30 shadow-sm'
                        }`}
                      >
                        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
                          isPast ? 'bg-muted' : 'bg-tropical-cyan/10 text-tropical-cyan'
                        }`}>
                          <span className="text-xs font-bold uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-black">{date.getDate()}</span>
                        </div>
                        <div>
                           <p className="font-semibold">{h.localName || h.name}</p>
                           <p className="text-xs text-muted-foreground">{isPast ? 'Passed' : 'Upcoming'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  )
}
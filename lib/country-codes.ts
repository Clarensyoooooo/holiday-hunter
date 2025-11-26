// lib/country-codes.ts

export const ISO_MAP: Record<string, string> = {
  US: "USA", // United States
  GB: "GBR", // United Kingdom
  DE: "DEU", // Germany
  FR: "FRA", // France
  JP: "JPN", // Japan
  CA: "CAN", // Canada
  AU: "AUS", // Australia
  BR: "BRA", // Brazil
  IN: "IND", // India
  MX: "MEX", // Mexico
  IT: "ITA", // Italy
  ES: "ESP", // Spain
  NL: "NLD", // Netherlands
  PL: "POL", // Poland
  SE: "SWE", // Sweden
}

// Helper to go from Map Code (USA) -> API Code (US)
export const REVERSE_ISO_MAP = Object.entries(ISO_MAP).reduce((acc, [k, v]) => {
  acc[v] = k
  return acc
}, {} as Record<string, string>)
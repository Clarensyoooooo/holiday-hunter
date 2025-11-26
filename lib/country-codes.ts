// lib/country-codes.ts

// Simple map of ISO 2 (API) to ISO 3 (Map)
export const ISO_MAP: Record<string, string> = {
  US: "USA", GB: "GBR", DE: "DEU", FR: "FRA", JP: "JPN",
  CA: "CAN", AU: "AUS", BR: "BRA", IN: "IND", MX: "MEX",
  IT: "ITA", ES: "ESP", NL: "NLD", PL: "POL", SE: "SWE",
  // Add more as you expand your country list...
}

// Reverse map for clicking the map to get back to API code
export const REVERSE_ISO_MAP = Object.entries(ISO_MAP).reduce((acc, [k, v]) => {
  acc[v] = k
  return acc
}, {} as Record<string, string>)
export interface CountryHolidays {
  code: string
  name: string
  emoji: string
  holidayCount: number
  holidays: {
    date: string
    name: string
    localName: string
  }[]
}

export interface MonthStats {
  month: string
  count: number
  index: number
}

export interface UpcomingHoliday {
  date: string
  name: string
  country: string
  countryCode: string
  daysUntil: number
  emoji: string
}

// Add this to lib/types.ts
export interface NagerHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  global: boolean // <--- Important!
  types: string[]
}
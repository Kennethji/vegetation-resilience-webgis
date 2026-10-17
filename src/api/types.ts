export interface YearlyAc1Record {
  year: number
  value: number
  climateCode?: string
  climateLabel?: string
}

export interface ClimateStatRecord {
  climateCode: string
  climateLabel: string
  meanAc1: number
}

export interface PixelQueryResult {
  value: number | null
  periodLabel: string
  layerName: string
}

export interface ClimateQueryResult {
  code: string
  label: string
}
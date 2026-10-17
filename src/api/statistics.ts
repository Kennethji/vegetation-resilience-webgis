import type { YearlyAc1Record } from './types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api'

export async function fetchYearlyAc1(
  climateCode: string,
): Promise<YearlyAc1Record[]> {
  const params = new URLSearchParams({
    climate_code: climateCode,
  })

  const response = await fetch(
    `${API_BASE_URL}/yearly-ac1?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}
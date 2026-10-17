export type LayerKey =
  | 'mean'
  | 'trend'
  | 'mutation'
  | 'lisa'

export type PeriodKey =
  | 'all'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'

export interface ClimateConfig {
  label: string
  color: string
}

export interface ContinuousLegendConfig {
  type: 'continuous'
  title: string
  gradient: string
  labels: string[]
}

export interface CategoricalLegendItem {
  label: string
  color: string
}

export interface CategoricalLegendConfig {
  type: 'categorical'
  title: string
  items: CategoricalLegendItem[]
}

export type LegendConfig =
  | ContinuousLegendConfig
  | CategoricalLegendConfig

export interface QueryResult {
  label: string
  value: string
  interpretation: string
}

export interface ClimateResult {
  code: number
  label: string
}
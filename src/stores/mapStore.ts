import { defineStore } from 'pinia'
import type {
  LayerKey,
  PeriodKey,
} from '../types/map'

export const useMapStore = defineStore('map', {
  state: () => ({
    activeLayer: 'mean' as LayerKey,
    selectedPeriod: 'all' as PeriodKey,
    selectedClimateCode: 'all' as string,
    ac1Opacity: 0.85,
    viewMode: '2d' as '2d' | '3d',
  }),

  actions: {
    resetMapState() {
      this.activeLayer = 'mean'
      this.selectedPeriod = 'all'
      this.selectedClimateCode = 'all'
      this.ac1Opacity = 0.85
    },
  },
})
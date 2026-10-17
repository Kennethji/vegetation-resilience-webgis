import { periodLayerNames } from '../config/mapConfig'
import type { PeriodKey } from '../types/map'

const GEOSERVER_BASE_URL =
  import.meta.env.VITE_GEOSERVER_BASE_URL || '/geoserver'

export const GEOSERVER_WMS_URL =
  `${GEOSERVER_BASE_URL}/resilience/wms`

export const GEOSERVER_OWS_URL =
  `${GEOSERVER_BASE_URL}/resilience/ows`

export function getPeriodLayerName(period: PeriodKey) {
  return periodLayerNames[period]
}

export function createWmsParams(period: PeriodKey) {
  return {
    LAYERS: getPeriodLayerName(period),
    STYLES: 'ac1_continuous',
    TILED: true,
    FORMAT: 'image/png',
    TRANSPARENT: true,
    VERSION: '1.1.1',
  }
}

export function createFixedWmsParams(
  layerName: string,
  styleName: string
) {
  return {
    LAYERS: layerName,
    STYLES: styleName,
    TILED: true,
    FORMAT: 'image/png',
    TRANSPARENT: true,
    VERSION: '1.1.1',
  }
}

export function createClimateZonesWfsUrl() {
  const params = new URLSearchParams({
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: 'resilience:climate_zones',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
  })

  return `${GEOSERVER_OWS_URL}?${params.toString()}`
}
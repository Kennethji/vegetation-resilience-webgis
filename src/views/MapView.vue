<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import type { FeatureLike } from 'ol/Feature'
import Geometry from 'ol/geom/Geometry'
import Polygon from 'ol/geom/Polygon'
import MultiPolygon from 'ol/geom/MultiPolygon'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'
import ScaleLine from 'ol/control/ScaleLine'
import { defaults as defaultControls } from 'ol/control/defaults'
import { getRenderPixel } from 'ol/render'
import RenderEvent from 'ol/render/Event'
import {
  climateConfigs,
  legendConfigs,
  periodLabels,
} from '../config/mapConfig'
import type {
  ClimateResult,
  LayerKey,
  PeriodKey,
  QueryResult,
} from '../types/map'
import { storeToRefs } from 'pinia'
import { useMapStore } from '../stores/mapStore'
import TimeSeriesChart from '../components/TimeSeriesChart.vue'
import {
  GEOSERVER_WMS_URL,
  createWmsParams,
  createFixedWmsParams,
  createClimateZonesWfsUrl,
} from '../api/geoserver'
const mapElement = ref<HTMLElement | null>(null)
const mapStore = useMapStore()

const {
  activeLayer,
  selectedPeriod,
  selectedClimateCode,
  ac1Opacity,
} = storeToRefs(mapStore)
const basemapVisible = ref(true)
const queryResult = ref<QueryResult | null>(null)
const queryLoading = ref(false)
const climateVisible = ref(true)
const climateResult = ref<ClimateResult | null>(null)

let climateSource: VectorSource<Feature<Geometry>> | null = null
let climateLayer: VectorLayer<
  VectorSource<Feature<Geometry>>,
  Feature<Geometry>
> | null = null
let selectedClimateFeature: FeatureLike | null = null

const currentLegend = computed(
  () => legendConfigs[activeLayer.value]
)

const currentAnalysisPeriod = computed(() => {
  if (activeLayer.value === 'mean') {
    return periodLabels[selectedPeriod.value]
  }

  return '2001-2020'
})
let map: Map | null = null
let basemapLayer: TileLayer<XYZ> | null = null
let ac1Layer: TileLayer<TileWMS> | null = null

let trendLayer: TileLayer<TileWMS> | null = null
let mutationLayer: TileLayer<TileWMS> | null = null
let lisaLayer: TileLayer<TileWMS> | null = null
function getClimateStyle(feature: FeatureLike): Style | undefined {
  const code = Number(feature.get('gridcode'))

  if (
    selectedClimateCode.value !== 'all' &&
    code !== Number(selectedClimateCode.value)
  ) {
    return undefined
  }

  const config = climateConfigs[code]
  const isSelected = feature === selectedClimateFeature
  const color = config?.color ?? '#666666'

  return new Style({
    stroke: new Stroke({
      color: isSelected ? '#d73027' : color,
      width: isSelected ? 3 : 1.2,
    }),
    fill: new Fill({
      color: isSelected
        ? 'rgba(215, 48, 39, 0.18)'
        : 'rgba(255, 255, 255, 0.03)',
    }),
  })
}

function toggleClimateLayer() {
  climateLayer?.setVisible(climateVisible.value)
  refreshResultLayers()
}

function refreshResultLayers() {
  ac1Layer?.changed()
  trendLayer?.changed()
  mutationLayer?.changed()
  lisaLayer?.changed()
}

function changeClimateFilter() {
  selectedClimateFeature = null
  climateResult.value = null

  climateLayer?.changed()
  refreshResultLayers()
}
function applyClimateClip(event: RenderEvent) {
  const context = event.context as CanvasRenderingContext2D
  context.save()

  if (
    selectedClimateCode.value === 'all' ||
    !climateVisible.value ||
    !climateSource
  ) {
    return
  }

  const selectedCode = Number(selectedClimateCode.value)

  const features = climateSource
    .getFeatures()
    .filter(
      (feature) =>
        Number(feature.get('gridcode')) === selectedCode
    )

  if (features.length === 0) {
    return
  }

  context.beginPath()

  let hasValidPath = false

  features.forEach((feature) => {
    const geometry = feature.getGeometry()

    if (!geometry) {
      return
    }

    let polygons: Polygon[] = []

    if (geometry instanceof Polygon) {
      polygons = [geometry]
    } else if (geometry instanceof MultiPolygon) {
      polygons = geometry.getPolygons()
    }

    polygons.forEach((polygon) => {
      const outerRing = polygon.getLinearRing(0)

      if (!outerRing) {
        return
      }

      const coordinates = outerRing.getCoordinates()

      if (coordinates.length < 3) {
        return
      }

      coordinates.forEach((coordinate, index) => {
        const mapPixel = map?.getPixelFromCoordinate(coordinate)

  if (!mapPixel) {
    return
  }

  const renderPixel = getRenderPixel(event, mapPixel)

  if (index === 0) {
    context.moveTo(renderPixel[0], renderPixel[1])
  } else {
    context.lineTo(renderPixel[0], renderPixel[1])
  }
})

      context.closePath()
      hasValidPath = true
    })
  })

  if (hasValidPath) {
    context.clip()
  }
}

function restoreClimateClip(event: RenderEvent) {
  const context = event.context as CanvasRenderingContext2D
  context.restore()
}
onMounted(() => {
  if (!mapElement.value) {
    return
  }
  // Esri全球地形底图
  basemapLayer = new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'anonymous',
      attributions: 'Tiles © Esri',
      wrapX: false,
    }),
    visible: basemapVisible.value,
  })

  // GeoServer发布的多年平均AC1栅格
  ac1Layer = new TileLayer({
  source: new TileWMS({
    url: GEOSERVER_WMS_URL,
    params: createWmsParams(selectedPeriod.value as PeriodKey),
    serverType: 'geoserver',
    wrapX: false,
    transition: 0,
  }),
  visible: true,
  opacity: ac1Opacity.value,
})
trendLayer = new TileLayer({
  source: new TileWMS({
    url: GEOSERVER_WMS_URL,
    params: createFixedWmsParams(
      'resilience:ac1_trend',
      'ac1_trend_style'
    ),
    serverType: 'geoserver',
    wrapX: false,
  }),
  visible: false,
  opacity: ac1Opacity.value,
})

mutationLayer = new TileLayer({
  source: new TileWMS({
    url: GEOSERVER_WMS_URL,
    params: createFixedWmsParams(
      'resilience:mutation_year',
      'mutation_year_style'
    ),
    serverType: 'geoserver',
    wrapX: false,
  }),
  visible: false,
  opacity: ac1Opacity.value,
})

lisaLayer = new TileLayer({
  source: new TileWMS({
    url: GEOSERVER_WMS_URL,
    params: createFixedWmsParams(
      'resilience:lisa_cluster',
      'lisa_cluster_style'
    ),
    serverType: 'geoserver',
    wrapX: false,
  }),
  visible: false,
  opacity: ac1Opacity.value,
})
climateSource = new VectorSource({
  format: new GeoJSON(),
  url: createClimateZonesWfsUrl(),
})
climateSource.on('change', () => {
  if (climateSource?.getState() === 'ready') {
    refreshResultLayers()
  }
})
climateLayer = new VectorLayer({
  source: climateSource,
  style: getClimateStyle,
  visible: climateVisible.value,
  zIndex: 20,
})
const resultLayers = [
  ac1Layer,
  trendLayer,
  mutationLayer,
  lisaLayer,
]

resultLayers.forEach((layer) => {
  layer.on('prerender', applyClimateClip)
  layer.on('postrender', restoreClimateClip)
})
  map = new Map({
    target: mapElement.value,
    controls: defaultControls().extend([
     new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 120,
    }),
  ]),
    layers: [
      basemapLayer,
      ac1Layer,
      trendLayer,
      mutationLayer,
      lisaLayer,
      climateLayer!,
    ],
    view: new View({
      projection: 'EPSG:3857',
      center: fromLonLat([10, 20]),
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 12,
      multiWorld: false,
      extent: [
        -20037508.34,
        -20037508.34,
        20037508.34,
        20037508.34,
      ],
    }),
  })
  map.on('singleclick', async (event) => {
  const climateFeature = map!.forEachFeatureAtPixel(
    event.pixel,
    (feature) => feature,
    {
      layerFilter: (layer) => layer === climateLayer,
      hitTolerance: 4,
    }
  )

  selectedClimateFeature = climateFeature ?? null

  if (climateFeature) {
    const code = Number(climateFeature.get('gridcode'))

    climateResult.value = {
      code,
      label: climateConfigs[code]?.label ?? `气候类型${code}`,
    }
  } else {
    climateResult.value = null
  }

  climateLayer?.changed()

  const currentLayer = getActiveResultLayer()

if (!currentLayer) {
  return
}

  const resolution = map!.getView().getResolution()

 const currentSource = currentLayer.getSource()
 if (!currentSource || resolution === undefined) {
   queryResult.value = null
   return
 }
 const currentLayerName = currentSource.getParams().LAYERS
 const url = currentSource.getFeatureInfoUrl(
    event.coordinate,
    resolution,
    'EPSG:3857',
    {
      INFO_FORMAT: 'application/json',
      QUERY_LAYERS: currentLayerName,
      FEATURE_COUNT: 1,
    }
  )

  if (!url) {
    queryResult.value = null
    return
  }

  queryLoading.value = true

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      queryResult.value = null
      return
    }

    const properties = data.features[0].properties

    const rawValue =
      properties.GRAY_INDEX ??
      properties.VALUE ??
      properties.BAND1

    const value = Number(rawValue)

    if (!Number.isFinite(value)) {
      queryResult.value = null
      return
    }

    const displayValue =
  activeLayer.value === 'mutation' ||
  activeLayer.value === 'lisa'
    ? String(Math.round(value))
    : value.toFixed(3)
    
  queryResult.value = {
   label: currentLegend.value.title,
   value: displayValue,
   interpretation: interpretResult(
    activeLayer.value,
    value
  ),
}
  } catch (error) {
    console.error('像元查询失败', error)
    queryResult.value = null
  } finally {
    queryLoading.value = false
  }
})
})
function toggleBasemap() {
  basemapLayer?.setVisible(basemapVisible.value)
}
function updateAc1Opacity() {
  const opacity = Number(ac1Opacity.value)

  ac1Layer?.setOpacity(opacity)
  trendLayer?.setOpacity(opacity)
  mutationLayer?.setOpacity(opacity)
  lisaLayer?.setOpacity(opacity)
}
function switchResultLayer() {
  ac1Layer?.setVisible(activeLayer.value === 'mean')
  trendLayer?.setVisible(activeLayer.value === 'trend')
  mutationLayer?.setVisible(activeLayer.value === 'mutation')
  lisaLayer?.setVisible(activeLayer.value === 'lisa')

  queryResult.value = null
}
function getActiveResultLayer() {
  const layers = {
    mean: ac1Layer,
    trend: trendLayer,
    mutation: mutationLayer,
    lisa: lisaLayer,
  }

  return layers[activeLayer.value]
}

function interpretResult(layerKey: LayerKey, value: number): string {
  if (layerKey === 'mean') {
    return 'AC1越高，表示扰动影响衰减越慢，植被韧性越低。'
  }

  if (layerKey === 'trend') {
    if (value > 0) {
      return 'AC1呈上升趋势，表明植被韧性趋于下降。'
    }

    if (value < 0) {
      return 'AC1呈下降趋势，表明植被韧性趋于增强。'
    }

    return 'AC1变化趋势接近于0。'
  }

  if (layerKey === 'mutation') {
    return `该像元的显著突变年份为${Math.round(value)}年。`
  }

  const lisaLabels: Record<number, string> = {
    0: '未划分类别',
    1: '高-高集聚',
    2: '低-低集聚',
    3: '高-低集聚',
    4: '低-高集聚',
  }

  return lisaLabels[Math.round(value)] ?? '未知类别'
}
function changePeriod() {
  const source = ac1Layer?.getSource()

  if (!source) {
    return
  }

  source.updateParams(
    createWmsParams(selectedPeriod.value as PeriodKey)
  )

  activeLayer.value = 'mean'
  switchResultLayer()
  queryResult.value = null
}
onBeforeUnmount(() => {
  if (map) {
    map.setTarget(undefined)
    map = null
  }
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div>
        <h1>全球植被韧性时空格局可视化平台</h1>
        <p>Global Vegetation Resilience WebGIS</p>
      </div>

      <div class="period">{{ currentAnalysisPeriod }}</div>
    </header>

    <main class="workspace">
      <aside class="sidebar">
        <section>
          <h2>图层管理</h2>

          <label class="layer-item">
            <input
              v-model="basemapVisible"
              type="checkbox"
              @change="toggleBasemap"
            />
            <span>Esri全球地形底图</span>
          </label>

          <div class="result-layers">
  <label>
    <input
      v-model="activeLayer"
      type="radio"
      value="mean"
      @change="switchResultLayer"
    />
    <span>多年平均AC1</span>
  </label>

  <label>
    <input
      v-model="activeLayer"
      type="radio"
      value="trend"
      @change="switchResultLayer"
    />
    <span>AC1变化趋势</span>
  </label>

  <label>
    <input
      v-model="activeLayer"
      type="radio"
      value="mutation"
      @change="switchResultLayer"
    />
    <span>显著突变年份</span>
  </label>

  <label>
    <input
      v-model="activeLayer"
      type="radio"
      value="lisa"
      @change="switchResultLayer"
    />
    <span>AC1空间集聚类型</span>
  </label>
</div>
<div class="period-control">
  <label for="period-select">当前图层分析时段</label>

  <select
    v-if="activeLayer === 'mean'"
    id="period-select"
    v-model="selectedPeriod"
    @change="changePeriod"
  >
    <option value="all">2001-2020</option>
    <option value="p1">2001-2005</option>
    <option value="p2">2006-2010</option>
    <option value="p3">2011-2015</option>
    <option value="p4">2016-2020</option>
  </select>

  <p v-else class="fixed-period">
    2001-2020，固定分析时段
  </p>
</div>
<div class="climate-control">
  <label class="layer-item">
    <input
      v-model="climateVisible"
      type="checkbox"
      @change="toggleClimateLayer"
    />
    <span>气候区边界</span>
  </label>

  <label for="climate-select">按气候区显示结果</label>

  <select
    id="climate-select"
    v-model="selectedClimateCode"
    :disabled="!climateVisible"
    @change="changeClimateFilter"
  >
    <option value="all">全部气候区</option>
    <option value="1">热带</option>
    <option value="2">干旱带</option>
    <option value="3">温带</option>
    <option value="4">大陆性气候区</option>
    <option value="5">极地</option>
  </select>
</div>
<div class="opacity-control">
  <label for="ac1-opacity">
    图层透明度
    <span>{{ Math.round(ac1Opacity * 100) }}%</span>
  </label>
  <input
   id="ac1-opacity"
    v-model="ac1Opacity"
    type="range"
    min="0"
    max="1"
    step="0.05"
    @input="updateAc1Opacity"
            />
          </div>
        </section>
        <section>
  <h2>图例</h2>

  <template v-if="currentLegend.type === 'continuous'">
    <div
      class="legend-bar"
      :style="{ background: currentLegend.gradient }"
    ></div>

    <div class="legend-labels">
      <span
        v-for="label in currentLegend.labels"
        :key="label"
      >
        {{ label }}
      </span>
    </div>
  </template>

  <div v-else class="category-legend">
    <div
      v-for="item in currentLegend.items"
      :key="item.label"
      class="category-item"
    >
      <span
        class="color-box"
        :style="{ backgroundColor: item.color }"
      ></span>

      <span>{{ item.label }}</span>
    </div>
  </div>

  <p class="legend-title">
    {{ currentLegend.title }}
  </p>
</section>
        <section>
          <h2>像元查询</h2>

          <p v-if="queryLoading" class="query-hint">
            正在查询……
          </p>

          <div v-else-if="queryResult" class="query-result">
            <div class="query-value">
              <span>{{ queryResult.label }}</span>
              <strong>{{ queryResult.value }}</strong>
            </div>

            <p>{{ queryResult.interpretation }}</p>
          </div>

          <p v-else class="query-hint">
            单击地图中的植被区域查看像元值。
          </p>
        </section>

        <section>
          <h2>气候区查询</h2>

          <div v-if="climateResult" class="query-result">
            <div class="query-value">
              <span>气候类型</span>
              <strong>{{ climateResult.label }}</strong>
            </div>

            <p>分类代码：{{ climateResult.code }}</p>
          </div>

          <p v-else class="query-hint">
            单击地图中的气候区查看分类信息。
          </p>
        </section>
        <section>
          <h2>年度变化</h2>
          <TimeSeriesChart />
        </section>
        <section>
          <h2>指标说明</h2>

          <p>
            AC1越高，表示植被状态持续性越强、扰动影响衰减越慢，植被韧性越低。
          </p>
        </section>
      </aside>

      <div ref="mapElement" class="map"></div>
    </main>
  </div>
</template>

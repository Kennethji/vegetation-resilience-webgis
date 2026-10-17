<script setup lang="ts">
import {
  Color,
  ImageryLayer,
  Viewer,
  WebMapServiceImageryProvider,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { storeToRefs } from 'pinia'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useMapStore } from '../stores/mapStore'
import {
  GEOSERVER_WMS_URL,
  getPeriodLayerName,
} from '../api/geoserver'
import type { PeriodKey } from '../types/map'

const globeElement = ref<HTMLElement | null>(null)

const mapStore = useMapStore()
const {
  selectedPeriod,
  ac1Opacity,
} = storeToRefs(mapStore)

let viewer: Viewer | null = null
let resultLayer:
  ReturnType<Viewer['imageryLayers']['addImageryProvider']>
  | null = null

function addResultLayer() {
  if (!viewer) {
    return
  }

  if (resultLayer) {
  viewer.imageryLayers.remove(resultLayer, true)
  resultLayer = null
}

  const layerName =
  getPeriodLayerName(selectedPeriod.value as PeriodKey)

  const provider = new WebMapServiceImageryProvider({
  url: GEOSERVER_WMS_URL,
  layers: layerName,
  parameters: {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    styles: 'ac1_continuous',
    format: 'image/png',
    transparent: true,
    tiled: true,
  },
  enablePickFeatures: false,
})
provider.errorEvent.addEventListener((error) => {
  console.error('Cesium WMS加载失败', error)
})
  resultLayer =
    viewer.imageryLayers.addImageryProvider(provider)

  resultLayer.alpha = Number(ac1Opacity.value)
}

onMounted(() => {
  if (!globeElement.value) {
    return
  }

  viewer = new Viewer(globeElement.value, {
    baseLayer: false,
    animation: false,
    timeline: false,
    geocoder: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
  })
  viewer.resolutionScale = 0.75
  viewer.scene.globe.enableLighting = false
  viewer.scene.requestRender()
  viewer.scene.backgroundColor =
    Color.fromCssColorString('#eef2f1')

  viewer.scene.globe.baseColor =
    Color.fromCssColorString('#d9e4e1')

  viewer.camera.flyHome(0)
  addResultLayer()
})

watch(selectedPeriod, () => {
  addResultLayer()
  viewer?.scene.requestRender()
})

watch(ac1Opacity, (opacity) => {
  if (resultLayer) {
    resultLayer.alpha = Number(opacity)
    viewer?.scene.requestRender()
  }
})

onBeforeUnmount(() => {
  viewer?.destroy()
  viewer = null
  resultLayer = null
})
</script>

<template>
  <main class="globe-page">
    <aside class="globe-sidebar">
      <h1>三维植被韧性展示</h1>

      <label for="globe-period">分析时段</label>

      <select
        id="globe-period"
        v-model="selectedPeriod"
      >
        <option value="all">2001—2020年</option>
        <option value="p1">2001—2005年</option>
        <option value="p2">2006—2010年</option>
        <option value="p3">2011—2015年</option>
        <option value="p4">2016—2020年</option>
      </select>

      <label for="globe-opacity">
        图层透明度
        {{ Math.round(Number(ac1Opacity) * 100) }}%
      </label>

      <input
        id="globe-opacity"
        v-model="ac1Opacity"
        type="range"
        min="0"
        max="1"
        step="0.05"
      />

      <p>
        三维页面通过Cesium加载GeoServer发布的WMS栅格。
        时段和透明度状态与二维地图共享。
      </p>
    </aside>

    <div
      ref="globeElement"
      class="cesium-globe"
    ></div>
  </main>
</template>
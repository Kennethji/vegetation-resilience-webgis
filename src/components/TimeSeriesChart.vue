<script setup lang="ts">
import { fetchYearlyAc1 } from '../api/statistics'
import type { YearlyAc1Record } from '../api/types'
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()
const { selectedClimateCode } = storeToRefs(mapStore)

const chartElement = ref<HTMLElement | null>(null)
const loading = ref(false)
const errorMessage = ref('')

let chart: echarts.ECharts | null = null

const climateNameByCode: Record<string, string> = {
  '1': 'Tropical',
  '2': 'Arid',
  '3': 'Temperate',
  '4': 'Continental',
  '5': 'Polar',
}

const climateLabelByCode: Record<string, string> = {
  all: '全球',
  '1': '热带',
  '2': '干旱带',
  '3': '温带',
  '4': '大陆性气候区',
  '5': '极地',
}

function renderChart(data: YearlyAc1Record[]) {
  if (!chart) {
    return
  }

  const regionLabel =
    climateLabelByCode[selectedClimateCode.value] ?? '未知区域'

  chart.setOption({
    title: {
      text: `${regionLabel}年度AC1变化`,
      left: 'center',
      textStyle: {
        fontSize: 13,
      },
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number) =>
        Number(value).toFixed(3),
    },
    grid: {
      top: 48,
      right: 16,
      bottom: 36,
      left: 48,
    },
    xAxis: {
      type: 'category',
      name: '年份',
      data: data.map((item) => item.year),
    },
    yAxis: {
      type: 'value',
      name: 'AC1',
      scale: true,
    },
    series: [
      {
        name: 'AC1',
        type: 'line',
        smooth: true,
        symbolSize: 5,
        data: data.map((item) =>
          Number(item.value.toFixed(3)),
        ),
        lineStyle: {
          color: '#287866',
          width: 2,
        },
        itemStyle: {
          color: '#287866',
        },
      },
    ],
  })
}

async function loadTimeSeries() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await fetchYearlyAc1(
      selectedClimateCode.value,
    )

    await nextTick()
    renderChart(data)
  } catch (error) {
    console.error('时间序列加载失败', error)
    errorMessage.value = '年度统计数据加载失败'
  } finally {
    loading.value = false
  }
}

function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  if (!chartElement.value) {
    return
  }

  chart = echarts.init(chartElement.value)
  window.addEventListener('resize', resizeChart)
  loadTimeSeries()
})

watch(selectedClimateCode, () => {
  loadTimeSeries()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div class="time-series-panel">
    <p v-if="loading" class="chart-message">
      正在加载年度统计数据……
    </p>

    <p v-if="errorMessage" class="chart-message chart-error">
      {{ errorMessage }}
    </p>

    <div
      ref="chartElement"
      class="time-series-chart"
    ></div>
  </div>
</template>
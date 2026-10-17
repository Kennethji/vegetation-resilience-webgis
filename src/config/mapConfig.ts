import type {
  ClimateConfig,
  LayerKey,
  LegendConfig,
  PeriodKey,
} from '../types/map'
export const climateConfigs: Record<number, ClimateConfig> = {
  1: { label: '热带', color: '#1b9e77' },
  2: { label: '干旱带', color: '#e6ab02' },
  3: { label: '温带', color: '#66a61e' },
  4: { label: '大陆性气候区', color: '#377eb8' },
  5: { label: '极地', color: '#a6cee3' },
}

export const legendConfigs: Record<LayerKey, LegendConfig> = {
  mean: {
    type: 'continuous',
    title: '滞后一期自相关系数',
    gradient:
      'linear-gradient(to right, #313695, #4575b4, #74add1, #ffffbf, #fdae61, #f46d43, #a50026)',
    labels: ['-0.50', '0.00', '0.40', '0.60', '0.91'],
  },
  trend: {
    type: 'continuous',
    title: 'AC1变化趋势',
    gradient:
      'linear-gradient(to right, #2166ac, #92c5de, #f7f7f7, #f4a582, #b2182b)',
    labels: ['-0.173', '-0.05', '0', '0.15', '0.348'],
  },
  mutation: {
    type: 'continuous',
    title: '显著突变年份',
    gradient:
      'linear-gradient(to right, #542788, #8073ac, #d8daeb, #fee0b6, #e08214)',
    labels: ['2001', '2005', '2010', '2015', '2020'],
  },
  lisa: {
    type: 'categorical',
    title: 'AC1空间集聚类型',
    items: [
      { label: '高-高', color: '#d7191c' },
      { label: '低-低', color: '#2c7bb6' },
      { label: '高-低', color: '#fdae61' },
      { label: '低-高', color: '#abd9e9' },
    ],
  },
}

export const periodLabels: Record<PeriodKey, string> = {
  all: '2001-2020',
  p1: '2001-2005',
  p2: '2006-2010',
  p3: '2011-2015',
  p4: '2016-2020',
}

export const periodLayerNames: Record<PeriodKey, string> = {
  all: 'resilience:mean_kndvi_ac1',
  p1: 'resilience:mean_ac1_2001_2005',
  p2: 'resilience:mean_ac1_2006_2010',
  p3: 'resilience:mean_ac1_2011_2015',
  p4: 'resilience:mean_ac1_2016_2020',
}

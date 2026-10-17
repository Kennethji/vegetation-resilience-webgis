import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/Workers',
          dest: 'cesiumStatic',
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Assets',
          dest: 'cesiumStatic',
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Widgets',
          dest: 'cesiumStatic',
        },
        {
          src: 'node_modules/cesium/Build/Cesium/ThirdParty',
          dest: 'cesiumStatic',
        },
      ],
    }),
  ],

  define: {
    CESIUM_BASE_URL: JSON.stringify(
      '/cesiumStatic/node_modules/cesium/Build/Cesium/',
    ),
  },

  server: {
    proxy: {
      '/geoserver': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
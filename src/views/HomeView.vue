<template>
  <main class="home-page">
    <section class="home-card">
      <p class="home-tag">WebGIS Portfolio</p>

      <h1>全球植被韧性时空格局可视化平台</h1>

      <p>
        基于全球植被韧性数据构建的二维与三维WebGIS展示系统，
        支持栅格图层切换、气候区筛选、像元查询和统计分析。
      </p>

      <div class="tech-list">
        <span>Vue 3</span>
        <span>TypeScript</span>
        <span>Pinia</span>
        <span>Vue Router</span>
        <span>OpenLayers</span>
        <span>GeoServer</span>
        <span>PostGIS</span>
      </div>

      <div class="home-actions">
        <RouterLink to="/map">进入二维地图</RouterLink>
        <RouterLink to="/globe">进入三维地图</RouterLink>
      </div>
    </section>
  </main>
</template>
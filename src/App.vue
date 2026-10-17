<template>
  <div class="site-shell">
    <nav class="site-nav">
      <RouterLink to="/">项目首页</RouterLink>
      <RouterLink to="/map">二维地图</RouterLink>
      <RouterLink to="/globe">三维地球</RouterLink>
    </nav>

    <div class="route-content">
      <RouterView />
    </div>
  </div>
</template>
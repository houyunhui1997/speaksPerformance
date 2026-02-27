<template>
  <div class="page-container">
    <h1>首页 (Index)</h1>
    <nav>
      <router-link to="/footprint">足迹</router-link> |
      <router-link to="/hotspot">热点</router-link> |
      <router-link to="/public-opinion">舆情</router-link> |
      <router-link to="/topic">话题</router-link>
    </nav>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  color: white;
}
nav {
  margin-top: 20px;
}
nav a {
  color: #42b983;
  margin: 0 10px;
  text-decoration: none;
}
</style>

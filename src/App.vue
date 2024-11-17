<template>
  <div class="apc">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { routes } from "./router/index";
</script>

<style scoped lang="less">
.apc {
  height: 100vh;
  width: 100%;
  display: flex;
  padding: 12px;
}
</style>

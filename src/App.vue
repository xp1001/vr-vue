<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ImgTitle from '@/components/ImgTitle.vue'
import { picUrl } from '@/lib/BaseFile'

// window.addEventListener('touchstart', function (event) {
//   // 防止默认的双指缩放行为
//   if (event.touches.length === 2) {
//     event.preventDefault();
//   }
// }, { passive: false });
</script>

<template>
  <header class="header-container">
    <nav>
        <ImgTitle :imgPath="picUrl('jpg/1.jpg')" title="Home" @click="$router.push('/')" />
        <ImgTitle :imgPath="picUrl('/jpg/2.jpg')" title="About" @click="$router.push('/about')" />
        <ImgTitle :imgPath="picUrl('/jpg/3.jpg')" title="主入口" @click="$router.push('/main')" />
        <ImgTitle :imgPath="picUrl('/jpg/4.jpg')" title="中心" @click="$router.push('/center')" />
        <ImgTitle :imgPath="picUrl('/jpg/5.jpg')" title="DEBUG" @click="$router.push('/debug')" />
        
      </nav>
  </header>
  <RouterView v-slot="{ Component }">
    <!-- 缓存路由组件，避免切换后状态丢失 -->
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  justify-items: center;
}
nav {
  width: 98%;
  min-width: 98%;
  padding: 10px;
  background-color: grey;
  color: white;
  display: flex;
  gap: 1rem;
  position: absolute;
  z-index: 999;
  bottom: 1rem;
  overflow-x: auto;
  white-space: nowrap;
  flex-wrap: nowrap; /* 确保子元素不换行 */
  /* border: 1px solid red; 调试边框 */
  justify-content: space-between;
  overflow-x: auto;
  box-sizing: border-box; /* 确保内边距包含在元素的宽度和高度内 */
  /* 屏幕大于1024px时，居中 */
  @media (min-width: 1024px) {
    justify-content: center;
  }
}

</style>

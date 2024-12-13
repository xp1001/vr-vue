<script setup lang="ts">
defineProps<{
  imgPath: string,
  title: string
}>()
</script>

<template>
  <div class="greetings">
    <!-- 上下显示，上面是图片，下面是标题 -->
     <div class="greetings-img">
      <img class="greetings-img" :src="imgPath" :alt="title" />
    </div>
    <div class="greetings-title">
      <h3 class="text-gradient">{{ title }}</h3>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.greetings-img {
  width: 5rem;
  height: 5rem;
}
.greetings-title {
  text-align: center;
}
.text-gradient {
  background: linear-gradient(to right, #2f19fc, #7873f5);
}
</style>

<script setup lang="ts">
defineProps<{
  imgPath?: string,
  desc: string
}>()
</script>

<template>
  <div class="greetings">
    <div class="greetings-title">
      <h3 class="text-gradient">{{ desc }}</h3>
    </div>
    <!-- div要占位，后续使用sprite标签时，不需要img，但是文字需要在sprite之上 -->
     <div class="greetings-img">
      <img class="greetings-img" :src="imgPath" alt="vr" v-if="imgPath"/>
    </div>
  </div>
</template>

<style scoped>
h3 {
  font-size: 1.2rem;
}

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



</style>

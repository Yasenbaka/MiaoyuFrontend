<script setup lang="ts">
import "@/assets/Block.css";
import "@/assets/Alignment.css";
import "@/assets/Button.css";

import {useRouter} from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="full_screen_block flex_all_direction_center block_box">
    <h2>正在验证登录账号的权限</h2>
    <button class="white_translucent_5r_button" @click="router.push({name: 'Home'})">返回主页</button>
  </div>
</template>

<style scoped>
@keyframes block_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.block_box {
  animation: block_in .5s forwards;
  background-color: rgba(44, 49, 80, 0.8);
  color: white;
  flex-direction: column;
}
</style>

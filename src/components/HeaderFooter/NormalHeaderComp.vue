<script setup lang="ts">
import "@/assets/Header.css";
import {useRouter} from "vue-router";
const router = useRouter();

const itemList: Array<{label: string; value: string}> = [
  {label: "主页", value: "Home"},
  {label: "网站管理", value: "Manage"},
  {label: "OA", value: "OA"}
]

const itemClicked = (value: string) => {
  router.push({name: value});
}
</script>

<template>
  <header class="header">
    <div>
      喵羽网络科技
    </div>
    <div class="header_items">
      <div v-for="item in itemList" :key="item.value" @click="itemClicked(item.value)">{{item.label}}</div>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: #b6b6b6 1px solid;
}
</style>

<script setup lang="ts">
import "@/assets/Header.css";
import {useRouter} from "vue-router";
import {onMounted} from "vue";
const router = useRouter();

const itemList: Array<{label: string; value: string}> = [
  {label: "合同", value: "OAContract"},
  {label: "发票", value: "OAInvoice"},
  {label: "返回主页", value: "Home"},
]

const itemClicked = (value: string) => {
  router.push({name: value});
}
</script>

<template>
  <header class="header">
<!--    <div class="header_title_box">-->
<!--      <p>喵羽网络科技企业办公系统</p>-->
<!--    </div>-->
    <div class="header_items">
      <div v-for="item in itemList" :key="item.value" @click="itemClicked(item.value)">{{item.label}}</div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #87c2fd;
  //border-bottom: #b6b6b6 1px solid;
  color: white;
}
</style>

<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();

const itemList: Array<{label: string; value: string;}> = [
  {label: "签卡", value: "OACheck"},
  {label: "人事", value: "OAStaff"},
  {label: "合同", value: "OAContract"},
  {label: "发票", value: "OAInvoice"},
  {label: "资产", value: "OAProperty"},
  {label: "盖章", value: "OAStamp"},
]

const itemClicked = (value: string) => {
  router.push({name: value});
}
</script>

<template>
  <div class="items">
    <div v-for="item in itemList" :key="item.value" class="text_flex_vertical_center item" @click="itemClicked(item.value)">
      <h2>{{item.label}}</h2>
      <p>{{item.value.replace("OA", "")}}</p>
    </div>
  </div>
</template>

<style scoped>
.items {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}
.item {
  border: #b6b6b6 1px solid;
  border-radius: 5px;
  width: 200px;
  height: 250px;
  p {
    font-size: 16px;
  }
}
</style>

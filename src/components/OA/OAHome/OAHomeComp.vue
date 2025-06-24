<script setup lang="ts">
import "@/assets/Alignment.css";
import {onMounted, ref} from "vue";
import {useOAPermissionBlockStore} from "@/stores/OAPermissionBlockStore.ts";
import OAHomeItemsComp from "@/components/OA/OAHome/OAHomeItemsComp.vue";
const OAPermissionBlockStore = useOAPermissionBlockStore();

const isToken = ref<boolean>(false);

const checkTokenPermission = () => {
  if (isToken.value) {
    OAPermissionBlockStore.changeStatus(isToken.value);
    setTimeout(() => {OAPermissionBlockStore.changeStatus(false)}, 3000);
  }
}

onMounted(() => {
  window.localStorage.getItem("token")? isToken.value = true: isToken.value = false;
  checkTokenPermission();
})
</script>

<template>
  <main class="main_box flex_all_direction_center">
    <div class="main_title flex">
      <div class="text_flex_vertical_center">
        <h1>哈尔滨喵羽网络科技有限公司</h1>
        <p>Harbin Miaoyu Network Technology Co.,Ltd</p>
      </div>
      <div class="text_flex_vertical_center">
        <h2>企业在线办公系统</h2>
        <p>Enterprise Online Office Automation System</p>
      </div>
    </div>
    <div v-if="isToken">
      <OAHomeItemsComp/>
    </div>
    <div v-else>
      请先登录
    </div>
  </main>
</template>

<style scoped>
.main_box {
  flex-direction: column;
  gap: 30px;
}
.main_title {
  gap: 30px;
  flex-direction: column;
  color: #81a7fd;
  p {
    color: #505365;
  }
}
</style>

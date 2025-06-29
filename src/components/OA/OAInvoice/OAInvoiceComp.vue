<script setup lang="ts">

import OAInvoiceSideMenuComp from "@/components/OA/OAInvoice/OAInvoiceSideMenuComp.vue";
</script>

<template>
<!--  <div style="display: flex; flex-direction: row">-->
<!--    -->
<!--  </div>-->
  <el-container>
    <OAInvoiceSideMenuComp/>
    <el-main style="padding: 0; max-height: calc(100vh - 40px);">
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>

<script setup lang="ts">

import OAInvoiceSideMenuComp from "@/components/OA/OAInvoice/OAInvoiceSideMenuComp.vue";
</script>

<template>
  <div style="display: flex; flex-direction: row">
    <OAInvoiceSideMenuComp/>
    <RouterView style="width: 70vw"/>
  </div>

</template>

<style scoped>

</style>

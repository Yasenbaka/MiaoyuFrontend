<script setup lang="ts">
import OAHeaderComp from "@/components/OA/OAHeaderComp.vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import OAPermissionBlockComp from "@/components/OA/OAPermissionBlockComp.vue";
import {useOAPermissionBlockStore} from "@/stores/OAPermissionBlockStore.ts";
const OAPermissionBlockStore = useOAPermissionBlockStore();

const isBlockShow = ref<boolean>(false);

onBeforeUnmount(() => {OAPermissionBlockStore.changeStatus(false)});

watch(() => OAPermissionBlockStore.isShow, (newVal: boolean) => {
  isBlockShow.value = newVal;
})
</script>

<template>
  <OAPermissionBlockComp v-if="isBlockShow"/>
  <OAHeaderComp/>
  <RouterView/>
</template>

<style scoped>

</style>

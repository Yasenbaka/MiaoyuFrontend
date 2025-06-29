<script setup lang="ts">
import {
  View,
  Switch,
  Upload
} from "@element-plus/icons-vue";
import {markRaw} from "vue";
import type { Component } from "vue";
import {useRouter} from "vue-router";
const router = useRouter();

interface MenuImpl {label: string; value: string; icon?: Component | string; items?: Array<MenuImpl>}

const menuList: Array<MenuImpl> = [
  {label: "浏览发票", value: "OAInvoiceBrowse", icon: markRaw(View)},
  {label: "上传发票", value: "OAInvoiceUpload", icon: markRaw(Upload)},
  {label: "绑定发票", value: "OAInvoiceBind", icon: markRaw(Switch)}
]

const menuItemClicked = (value: string) => {
  router.push({name: value});
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
// #545c64 #87c2fd
</script>

<template>
  <menu style="min-width: 200px; padding: 0;">
    <el-col :span="24"  style="max-height: 100vh; overflow: auto;">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#83A8FDFF"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        style="min-height: calc(100vh - 40px);"
      >
        <template v-for="item in menuList" :key="item.value">
          <el-sub-menu v-if="item.items?.length" :index="item.value">
            <template #title>
              <el-icon><component :is="item.icon"/></el-icon>
              <span>{{item.label}}</span>
            </template>
            <el-menu-item v-for="subItem in item.items" :key="subItem.value" :index="subItem.value" @click="menuItemClicked(subItem.value)">
              <el-icon><component :is="subItem.icon"/></el-icon>
              <span>{{subItem.label}}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else @click="menuItemClicked(item.value)">
            <el-icon><component :is="item.icon"/></el-icon>
            <span>{{item.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
  </menu>
</template>

<style scoped>

</style>

<script setup lang="ts">
defineProps({
  property: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<template>
  <el-tag
    :property="property === 'OUTPUT' ? '#FF4040' : ''"
    :color="property === 'INPUT' ? '#d54e4e' : '#2bc975'"
    class="invoice-tag"
  >
    {{ label }}
  </el-tag>
</template>

<style scoped>
.invoice-tag {
  color: white;
  border: none;
  min-width: 30px;
  text-align: center;
}

/* 专票红色样式 */
.el-tag--danger {
  background-color: #f56c6c;
}

/* 普票蓝色样式 */
.el-tag[color="#409EFF"] {
  background-color: #409EFF;
}
</style>

<script setup lang="ts">
defineProps({
  type: {
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
    :type="type === 'SPECIAL' ? 'danger' : ''"
    :color="type === 'NORMAL' ? '#409EFF' : ''"
    class="invoice-tag"
  >
    {{ label }}
  </el-tag>
</template>

<style scoped>
.invoice-tag {
  color: white;
  border: none;
  min-width: 60px;
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

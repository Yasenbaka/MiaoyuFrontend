<script setup lang="ts">
import type {InvoiceBindImpl} from "@/interface/InvoiceImpl.ts";
import {ref} from "vue";
import {http} from "@/utils/http.ts";

const bindForm = ref<InvoiceBindImpl>({output_invoice_id: '', input_invoice_id: '', id: '', create_at: ''});

const uploadBind = async () => {
  if (bindForm.value.output_invoice_id === '' ||  bindForm.value.input_invoice_id === '') {
    alert("票号不得为空"); return;
  }
  http({
    url: "/invoice/bind/upload",
    method: "POST",
    data: bindForm.value
  }).then(res => {
    if (res?.data?.code === 0) {
      alert(res?.data?.message);
    } else alert(res?.data?.message);
  }).catch(() => {alert("错误")});
}
</script>

<template>
  <h4 style="width: 100%; background-color: #81a7fd; padding: 10px; color: #fdd1b9;">只能对销项发票进行发票绑定</h4>
  <el-form label-width="auto" :model="bindForm" style="padding: 10px; width: 500px" @submit.prevent="uploadBind">
    <el-form-item label="销项发票号："><el-input type="text" v-model="bindForm.output_invoice_id"/></el-form-item>
    <el-form-item label="进项发票号："><el-input type="text" v-model="bindForm.input_invoice_id"/></el-form-item>
    <el-button type="primary" native-type="submit">确认绑定</el-button>
  </el-form>
</template>

<style scoped>

</style>

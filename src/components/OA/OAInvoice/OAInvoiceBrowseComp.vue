<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import "@/assets/Alignment.css";
import {onMounted, ref, watch} from "vue";
import type {InvoiceImpl} from "@/interface/InvoiceImpl.ts";
import {http} from "@/utils/http.ts";
import type {ValueLabelImpl} from "@/interface/ValueLabelImpl.ts";
import OAInvoiceTypeTagComp from "@/components/OA/OAInvoice/OAInvoiceTypeTagComp.vue";
import OAInvoicePropertyTagComp from "@/components/OA/OAInvoice/OAInvoicePropertyTagComp.vue";
import {useRouter} from "vue-router";
const router = useRouter();

const quarterForm = ref<{year: number; quarter: number}>({year: new Date().getFullYear(), quarter: 0});
const rangeForm = ref<Array<string>>([]);
const invoiceList = ref<Array<InvoiceImpl> | null>(null);
const invoiceTypeOptions = ref<Array<ValueLabelImpl>>([]);
const invoicePropertyOptions = ref<Array<ValueLabelImpl>>([]);
const invoiceStatusOptions = ref<Array<ValueLabelImpl>>([]);

const fetchInvoiceByQuarter = async (): Promise<void> => {
  await http({
    url: "/invoice/all_by_quarter",
    method: "GET",
    params: quarterForm.value
  }).then(res => {
    if (res?.data?.code === 0) {
      invoiceList.value = res?.data?.data;
    } else {alert(res?.data?.message);}
  }).catch(() => {alert("错误！");});
}
const fetchInvoiceByRange = async (): Promise<void> => {
  if (rangeForm.value.length === 0) {
    alert("请选择日期范围区间");
    return;
  }
  await http({
    url: "/invoice/all_by_range",
    method: "GET",
    params: {
      start: rangeForm.value[0],
      end: rangeForm.value[1],}
  }).then(res => {
    if (res?.data?.code === 0) {
      invoiceList.value = res?.data?.data;
    } else alert(res?.data?.message);
  }).catch(() => {alert("错误");});
}
const fetchInvoiceTypePropertyStatus = async (): Promise<void> => {
  await http({url: "/invoice/vl_type", method: "GET"}).then(res => {
    if (res?.data?.code === 0) invoiceTypeOptions.value = res?.data?.data as Array<ValueLabelImpl>;
    else alert(res?.data?.message);
  }).catch(() => {alert("错误")});
  await http({url: "/invoice/vl_property", method: "GET"}).then(res => {
    if (res?.data?.code === 0) invoicePropertyOptions.value = res?.data?.data as Array<ValueLabelImpl>;
    else alert(res?.data?.message);
  }).catch(() => {alert("错误")});
  await http({url: "/invoice/vl_status", method: "GET"}).then(res => {
    if (res?.data?.code === 0) invoiceStatusOptions.value = res?.data?.data as Array<ValueLabelImpl>;
    else alert(res?.data?.message);
  }).catch(() => {alert("错误")});
}

// 格式化发票类型显示
const formatInvoiceType = (type: string): string => {
  const found = invoiceTypeOptions.value.find(item => item.value === type)
  return found ? found.label : type
}
// 格式化发票属性显示
const formatInvoiceProperty = (property: string): string => {
  const found = invoicePropertyOptions.value.find(item => item.value === property)
  return found ? found.label : property
}
// 格式化发票状态显示
const formatInvoiceStatus = (status: string): string => {
  const found = invoiceStatusOptions.value.find(item => item.value === status)
  return found ? found.label : status
}

const detailClicked = (invoice_id: string) => {
  router.push({name: "OAInvoiceOnly", query: {invoice_id: invoice_id}})
}

onMounted(async () => {
  await Promise.all([fetchInvoiceByQuarter(), fetchInvoiceTypePropertyStatus()]);
})
watch(() => rangeForm.value, newVal => {
  console.log(newVal);
})
</script>

<template>
  <div class="select_box flex">
    <div class="select_item">
      <h3>按年度季度检索</h3>
      <el-form :model="quarterForm" @submit.prevent="fetchInvoiceByQuarter">
        <el-form-item label="年度：" ><el-input type="number" v-model="quarterForm.year"/></el-form-item>
        <el-form-item label="季度：" >
          <el-radio-group v-model="quarterForm.quarter">
            <el-radio :value="0" size="large">全年</el-radio>
            <el-radio :value="1" size="large">一季度</el-radio>
            <el-radio :value="2" size="large">二季度</el-radio>
            <el-radio :value="3" size="large">三季度</el-radio>
            <el-radio :value="4" size="large">四季度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button native-type="submit" type="primary">查询</el-button>
      </el-form>
    </div>
    <div class="select_item">
      <h3>按日期区间检索</h3>
      <el-date-picker
        v-model="rangeForm"
        type="daterange"
        range-separator="到"
        start-placeholder="起始日期"
        end-placeholder="结束日期"
        :size="'default'"
        value-format="YYYY-MM-DD"
      />
      <br/>
      <el-button @click="fetchInvoiceByRange" native-type="button" type="primary">查询</el-button>
    </div>
    
  </div>
  <el-table :data="invoiceList" stripe style="width: 100%">
    <el-table-column prop="id" label="发票号" />
    <el-table-column prop="type" label="类型">
      <template #default="{ row }">
        <OAInvoiceTypeTagComp :label="formatInvoiceType(row.type)" :type="row.type"/>
      </template>
    </el-table-column>
    <el-table-column prop="property" label="销购项" >
      <template #default="{ row }">
        <OAInvoicePropertyTagComp :property="row.property" :label="formatInvoiceProperty(row.property)"/>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" >
      <template #default="{ row }">
        {{formatInvoiceStatus(row.status)}}
      </template>
    </el-table-column>
    <el-table-column prop="seller" label="销方" />
    <el-table-column prop="purchaser" label="购方" />
    <el-table-column prop="before_tax_amount" label="税前金额" />
    <el-table-column prop="tax_amount" label="税额" />
    <el-table-column prop="after_tax_amount" label="税后金额" />
    <el-table-column prop="issue_at" label="开具日期" />
    <el-table-column>
      <template #default="{ row }">
        <el-button type="primary" native-type="button" @click="detailClicked(row.id)">详细</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.select_box {
  gap: 30px;
  height: auto;
  padding: 10px;
}
.select_item {
  border-radius: 5px;
  box-shadow: #81a7fd 0 0 5px;
  padding: 10px;
}
.invoice_tag {
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

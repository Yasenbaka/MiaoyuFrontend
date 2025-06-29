<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import type {InvoiceImpl, InvoiceItemImpl} from "@/interface/InvoiceImpl.ts";
import {http} from "@/utils/http.ts";
import type {ValueLabelImpl} from "@/interface/ValueLabelImpl.ts";
import OAInvoiceTypeTagComp from "@/components/OA/OAInvoice/OAInvoiceTypeTagComp.vue";
import OAInvoicePropertyTagComp from "@/components/OA/OAInvoice/OAInvoicePropertyTagComp.vue";

const invoiceForm = ref<InvoiceImpl>(
  {id: '', type: '', property: '', status: '', seller: '', seller_id: '', purchaser: '', purchaser_id: '', before_tax_amount: 0, tax_amount: 0, tax_rate: 0, after_tax_amount: 0, remark: null, issue_at: ''}
);
let invoiceItemTemplate: InvoiceItemImpl = {
  id: '', invoice_id: '', name: '', specification: null, unit: '', quantity: 0, unit_price: 0, amount: 0, tax_rate: 0, tax_amount: 0, remark: null
}
const invoiceItemForm = ref<InvoiceItemImpl>(invoiceItemTemplate);
const isInvoiceItemFormShow = ref<boolean>(false);
const invoiceTypeOptions = ref<Array<ValueLabelImpl>>([]);
const invoicePropertyOptions = ref<Array<ValueLabelImpl>>([]);
const invoiceStatusOptions = ref<Array<ValueLabelImpl>>([]);

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

const uploadInvoice = async () => {
  http({
    url: "/invoice/upload",
    method: "POST",
    data: invoiceForm.value
  }).then(res => {
    if (res?.data?.code === 0) {
      alert(res?.data?.data);
      isInvoiceItemFormShow.value = true;
    }
  })
}
const uploadInvoiceItem = async () => {
  http({
    url: "/invoice/item/upload",
    method: "POST",
    data: invoiceItemForm.value
  }).then(res => {
    if (res?.data?.code === 0) {
      alert(res?.data?.data + "如果要继续追加商品/服务名目，请继续上传！");
    }
  })
}

onMounted(async () => {
  await Promise.all([fetchInvoiceTypePropertyStatus()]);
})

watch(() => invoiceForm.value.id, newVal => {
  invoiceItemForm.value.invoice_id = newVal;
  invoiceItemTemplate.invoice_id = newVal;
})
</script>

<template>
  <h4 style="width: 100%; background-color: #81a7fd; padding: 10px; color: #fdd1b9;">发票上传步骤：填写并上传发票总信息 -> 再填写发票商品/服务信息</h4>
  <div style="display: flex; gap: 30px; flex-wrap: wrap">
    <div class="invoice_upload_box" style="width: 500px; padding: 10px">
      <h3>发票总信息</h3>
      <el-form label-width="auto" :model="invoiceForm" v-if="invoiceTypeOptions && invoicePropertyOptions && invoiceStatusOptions" :disabled="isInvoiceItemFormShow" @submit.prevent="uploadInvoice">
        <el-form-item label="发票号："><el-input type="text" v-model="invoiceForm.id"/></el-form-item>
        <el-form-item label="发票类型：">
          <el-radio-group v-model="invoiceForm.type">
            <el-radio v-for="item in invoiceTypeOptions" :value="item.value" :key="item.value">
              <OAInvoiceTypeTagComp :label="item.label" :type="item.value"/>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资产属性：">
          <el-radio-group v-model="invoiceForm.property">
            <el-radio v-for="item in invoicePropertyOptions" :value="item.value" :key="item.value">
              <OAInvoicePropertyTagComp :property="item.value" :label="item.label"/>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票状态：">
          <el-radio-group v-model="invoiceForm.status">
            <el-radio v-for="item in invoiceStatusOptions" :value="item.value" :key="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销方主体："><el-input type="text" v-model="invoiceForm.seller"/></el-form-item>
        <el-form-item label="销方税号："><el-input type="text" v-model="invoiceForm.seller_id"/></el-form-item>
        <el-form-item label="购方主体："><el-input type="text" v-model="invoiceForm.purchaser"/></el-form-item>
        <el-form-item label="购方税号："><el-input type="text" v-model="invoiceForm.purchaser_id"/></el-form-item>
        <el-form-item label="税前金额："><el-input type="text" v-model="invoiceForm.before_tax_amount"/></el-form-item>
        <el-form-item label="税率："><el-input type="text" v-model="invoiceForm.tax_rate"/></el-form-item>
        <el-form-item label="税额："><el-input type="text" v-model="invoiceForm.tax_amount"/></el-form-item>
        <el-form-item label="价税合计："><el-input type="text" v-model="invoiceForm.after_tax_amount"/></el-form-item>
        <el-form-item label="开具日期：">
          <el-date-picker
            v-model="invoiceForm.issue_at"
            type="date"
            placeholder="选择日期"
            :size="'default'"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-button type="primary" native-type="submit">上传发票总信息</el-button>
      </el-form>
    </div>
    <div class="invoice_upload_box" style="width: 500px">
      <h3>发票商品/服务信息</h3>
      <el-form label-width="auto" :model="invoiceItemForm" :disabled="!isInvoiceItemFormShow" @submit.prevent="uploadInvoiceItem">
        <el-form-item label="发票号："><el-input type="text" v-model="invoiceItemForm.invoice_id" disabled/></el-form-item>
        <el-form-item label="商品/服务名目："><el-input type="text" v-model="invoiceItemForm.name" /></el-form-item>
        <el-form-item label="规格："><el-input type="text" v-model="invoiceItemForm.specification" /></el-form-item>
        <el-form-item label="单位："><el-input type="text" v-model="invoiceItemForm.unit" /></el-form-item>
        <el-form-item label="数量："><el-input type="text" v-model="invoiceItemForm.quantity" /></el-form-item>
        <el-form-item label="单价："><el-input type="text" v-model="invoiceItemForm.unit_price" /></el-form-item>
        <el-form-item label="价格："><el-input type="text" v-model="invoiceItemForm.amount" /></el-form-item>
        <el-form-item label="税率："><el-input type="text" v-model="invoiceItemForm.tax_rate" /></el-form-item>
        <el-form-item label="税额："><el-input type="text" v-model="invoiceItemForm.tax_amount" /></el-form-item>
        <el-form-item label="备注："><el-input type="text" v-model="invoiceItemForm.remark" /></el-form-item>
        <el-button type="primary" native-type="submit">上传商品/服务信息</el-button>
        <el-button type="danger" native-type="button" @click="invoiceItemForm = invoiceItemTemplate">清空表单</el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

</style>

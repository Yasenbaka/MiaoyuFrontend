<script setup lang="ts">
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {http} from "@/utils/http.ts";
import type {InvoiceBindImpl, InvoiceImpl, InvoiceItemImpl} from "@/interface/InvoiceImpl.ts";
import OAInvoiceTypeTagComp from "@/components/OA/OAInvoice/OAInvoiceTypeTagComp.vue";
import type {ValueLabelImpl} from "@/interface/ValueLabelImpl.ts";
import OAInvoicePropertyTagComp from "@/components/OA/OAInvoice/OAInvoicePropertyTagComp.vue";
import {ElMessageBox} from "element-plus";
import { InvoicePropertyEnum} from "@/enumeration/InvoiceTypeEnum.ts";

const  route = useRoute();
const router = useRouter();

// const invoice_id = ref<string | null>(null);
const invoice = ref<InvoiceImpl | null>(null);
const invoiceTypeOptions = ref<Array<ValueLabelImpl>>([]);
const invoicePropertyOptions = ref<Array<ValueLabelImpl>>([]);
const invoiceStatusOptions = ref<Array<ValueLabelImpl>>([]);
const invoiceItemForm = ref<InvoiceItemImpl>({
  invoice_id: '', name: '', specification: '', unit: '', quantity: 0, unit_price: 0, amount: 0, tax_rate: 0, tax_amount: 0, remark: ''
});

const isAddItemDialogShow = ref<boolean>(false);

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
// 解除发票绑定
const deleteBindClicked = async (invoice_id: string, invoice_property: InvoicePropertyEnum) => {
  if (!invoice.value) {
    alert("未检测到发票");
    return;
  }
  const invoiceBindForm: InvoiceBindImpl = {id: '', input_invoice_id: '', output_invoice_id: '', create_at: ''}
  if (invoice_property === InvoicePropertyEnum.INPUT) {
    invoiceBindForm.input_invoice_id = invoice_id;
    invoiceBindForm.output_invoice_id = invoice.value.id;
  } else {
    invoiceBindForm.input_invoice_id = invoice.value.id;
    invoiceBindForm.output_invoice_id = invoice_id;
  }
  await http({
    url: "/invoice/bind/delete_by_double_invoice_id",
    method: "DELETE",
    data: invoiceBindForm
  }).then(res => {
    alert(res?.data.message);
    router.go(0);
  }).catch(() => {alert("错误");});
}
// 删除商品名目
const deleteInvoiceItemClicked = async (item_id: string) => {
  await http({
    url: "/invoice/item/delete",
    method: "DELETE",
    params: {item_id}
  }).then(res => {
    alert(res?.data.message);
    router.go(0);
  }).catch(() => {alert("错误");});
}
//上传商品名目
const uploadInvoiceItemClicked = async () => {
  if (invoiceItemForm.value.name === '') {
    alert("商品/服务名目不能为空！");
    return;
  }
  await http({
    url: "/invoice/item/upload",
    method: "POST",
    data: invoiceItemForm.value
  }).then(res => {
    alert(res?.data.message);
    router.go(0);
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

const fetchInvoice = async (invoice_id: string): Promise<void> => {
  await http({
    url: "/invoice/only",
    method: "GET",
    params: {id: invoice_id}
  }).then(res => {
    if (res?.data?.code === 0) {
      invoice.value = res?.data?.data;
    } else alert(res?.data?.message);
  }).catch(() => {alert("错误");});
}

const detailClicked = (value: string) => {
  router.push({name: "OAInvoiceOnly", query: {invoice_id: value}});
}

const changeItemFormDialogShow = () => {
  if (invoice.value) {
    isAddItemDialogShow.value = true;
    invoiceItemForm.value.invoice_id = invoice.value.id;
  }
}
// const deleteBindClicked = (value: string) => {
//   http({url: "/invoice/bind/delete", method: "DELETE", params: {bind_id: value}})
// }

onMounted(async () => {
  await Promise.all([fetchInvoice(route.query?.invoice_id as string), fetchInvoiceTypePropertyStatus()]);
});
onBeforeRouteUpdate((to) => {
  if (to.query.invoice_id) {
    fetchInvoice(to.query.invoice_id as string);
  }
});
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <el-dialog
    v-model="isAddItemDialogShow"
    title="添加商品/服务名目">
    <el-form :model="invoiceItemForm" label-width="auto" @submit.prevent="uploadInvoiceItemClicked">
      <el-form-item label="发票号："><el-input disabled v-model="invoiceItemForm.invoice_id"/></el-form-item>
      <el-form-item label="名目："><el-input v-model="invoiceItemForm.name"/></el-form-item>
      <el-form-item label="规格："><el-input v-model="invoiceItemForm.specification"/></el-form-item>
      <el-form-item label="单位："><el-input v-model="invoiceItemForm.unit"/></el-form-item>
      <el-form-item label="数量："><el-input v-model="invoiceItemForm.quantity"/></el-form-item>
      <el-form-item label="单价："><el-input v-model="invoiceItemForm.unit_price"/></el-form-item>
      <el-form-item label="价格："><el-input v-model="invoiceItemForm.amount"/></el-form-item>
      <el-form-item label="税率："><el-input v-model="invoiceItemForm.tax_rate"/></el-form-item>
      <el-form-item label="税额："><el-input v-model="invoiceItemForm.tax_amount"/></el-form-item>
      <el-form-item label="备注："><el-input v-model="invoiceItemForm.remark"/></el-form-item>
      <el-form-item>
        <el-button type="success" native-type="submit">确认添加</el-button>
        <el-button type="warning" native-type="button" @click="isAddItemDialogShow = false">退出</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div style="width: 100%; background-color: #81a7fd; color: #fff; padding: 10px;">
    <p>发票信息仅能修改状态，如有其他修改，请删除该发票记录，重新录入。</p>
    <p>商品/服务名目不支持修改，如有修改，请先删除名目，再重新录入。</p>
  </div>
  <div class="block_box">
    <h3 style="text-align: center">发票详情</h3>
    <el-table v-if="invoice" :data="[invoice]">
      <el-table-column prop="id" label="发票号"/>
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
      <el-table-column prop="seller_id" label="销方税号" />
      <el-table-column prop="purchaser" label="购方" />
      <el-table-column prop="purchaser_id" label="购方税号" />
      <el-table-column prop="before_tax_amount" label="税前金额" />
      <el-table-column prop="tax_amount" label="税额" />
      <el-table-column prop="after_tax_amount" label="税后金额" />
      <el-table-column prop="issue_at" label="开具日期" />
      <el-table-column prop="create_at" label="记录日期" />
      <el-table-column prop="update_at" label="修改日期" />
    </el-table>
  </div>
  <div v-if="invoice && invoice.remark" class="block_box">
    <h3 style="text-align: center">发票备注</h3>
    <p>{{invoice.remark}}</p>
  </div>
  <div v-if="invoice" class="block_box">
    <h3 style="display: flex; align-items: center; justify-content: center; gap: 10px">
      商品/服务名目
      <el-button type="primary" native-type="button" @click="changeItemFormDialogShow">添加名目</el-button>
    </h3>
    <el-table :data="invoice.items">
      <el-table-column prop="name" label="名目"/>
      <el-table-column prop="specification" label="规格"/>
      <el-table-column prop="unit" label="单位"/>
      <el-table-column prop="quantity" label="数量"/>
      <el-table-column prop="unit_price" label="单价"/>
      <el-table-column prop="amount" label="价格"/>
      <el-table-column prop="tax_rate" label="税率"/>
      <el-table-column prop="tax_amount" label="税额"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="create_at" label="记录日期" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" native-type="button" @click="deleteInvoiceItemClicked(row.id)">删除名目</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="block_box" v-if="invoice && invoice.binds.length !== 0">
    <h3 style="display: flex; align-items: center; justify-content: center; gap: 10px">绑定发票</h3>
    <el-table :data="invoice.binds">
      <el-table-column prop="id" label="发票号"/>
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
      <el-table-column label="查看">
        <template #default="{ row }">
          <el-button @click="detailClicked(row.id)" native-type="button" type="primary">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="deleteBindClicked(row.id, row.property)" native-type="button" type="danger">解除绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>

import OAView from "@/views/OAView.vue";
import OAHomeComp from "@/components/OA/OAHome/OAHomeComp.vue";
import OAInvoiceComp from "@/components/OA/OAInvoice/OAInvoiceComp.vue";
import OAInvoiceBrowseComp from "@/components/OA/OAInvoice/OAInvoiceBrowseComp.vue";

export const OARouter = {
  path: "/oa",
  component: OAView,
  children: [
    {
      path: "",
      name: "OA",
      component: OAHomeComp
    },
    {
      path: "invoice",
      name: "OAInvoice",
      component: OAInvoiceComp,
      redirect: {name: "OAInvoiceBrowse"},
      children: [
        {
          path: "browse",
          name: "OAInvoiceBrowse",
          component: OAInvoiceBrowseComp
        }
      ]
    }
  ]
}

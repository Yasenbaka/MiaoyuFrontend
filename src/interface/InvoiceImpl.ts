export interface InvoiceImpl{
  id: string;
  type: string;
  property: string;
  status: string;
  seller: string;
  seller_id: string;
  purchaser: string;
  purchaser_id: string;
  before_tax_amount: number;
  tax_amount: number;
  tax_rate: number;
  after_tax_amount: number;
  remark: string | null;
  issue_at: string;
  create_at: string;
  update_at: string;
  items: Array<InvoiceItemImpl>;
  binds: Array<InvoiceImpl>;
}
export interface InvoiceItemImpl {
  id?: string;
  invoice_id: string;
  name: string;
  specification: string | null;
  unit: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  remark: string | null;
  create_at?: string;
  update_at?: string;
}
export interface InvoiceBindImpl {
  id: string;
  output_invoice_id: string;
  input_invoice_id: string;
  create_at: string;
}

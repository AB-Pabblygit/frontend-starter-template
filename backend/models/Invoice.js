import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  customer_id: {
    type: String,
    required: true,
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['paid', 'pending', 'failed', 'cancelled'],
    index: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  due_amount: {
    type: Number,
    default: 0
  },
  plan_id: [{
    type: String,
    index: true
  }],
  payment_term: String,
  subscription_id: {
    type: String,
    index: true
  },
  product_id: {
    type: String,
    required: true,
    index: true
  },
  setup_fee: {
    type: Number,
    default: 0
  },
  currency_symbol: String,
  currency_code: String,
  pcustomer_id: String,
  credit_note: {
    total_tax: String,
    status: String,
    new_plan_total: Number,
    total_credit_amount: Number,
    charge_amount: Number,
    credit_applied: []
  },
  due_date: Date,
  tax_apply: {
    id: String,
    country: String,
    taxes: mongoose.Schema.Types.Mixed,
    record_tax_id: Boolean,
    state: String,
    validate_tax_in: Boolean,
    tax_id: String,
    exempt_tax: [],
    total_amount: Number,
    total_amount_before_tax: Number,
    total_tax: Number
  },
  amount: {
    type: Number,
    required: true,
    index: true
  },
  invoice_id: {
    type: String,
    unique: true,
    index: true
  },
  order_number: String,
  expiry_date: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  cron_process: String,
  current_tracking_id: String,
  paid_date: {
    type: Date,
    index: true
  },
  retry: {
    type: Boolean,
    default: false
  },
  retry_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
invoiceSchema.index({ createdAt: 1, status: 1 });
invoiceSchema.index({ product_id: 1, createdAt: 1 });
invoiceSchema.index({ plan_id: 1, createdAt: 1 });
invoiceSchema.index({ customer_id: 1, createdAt: 1 });

export default mongoose.model('Invoice', invoiceSchema);

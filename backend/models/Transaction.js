import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  customer_id: {
    type: String,
    required: true,
    index: true
  },
  subscription_id: {
    type: String,
    required: true,
    index: true
  },
  invoice_id: {
    type: String,
    index: true
  },
  plan_id: {
    type: String,
    index: true
  },
  product_id: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['payment', 'refund', 'chargeback'],
    index: true
  },
  type_formated: String,
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'pending', 'cancelled'],
    index: true
  },
  status_formatted: String,
  amount: {
    type: Number,
    required: true,
    index: true
  },
  payment_note: String,
  payment_mode: String,
  reference_id: String,
  description: String,
  pcustomer_id: String,
  transaction: {
    account_id: String,
    contains: [String],
    created_at: Number,
    entity: String,
    event: String,
    payload: mongoose.Schema.Types.Mixed
  },
  gateway_type: String,
  gateway_id: String,
  currency_symbol: String,
  currency_code: String,
  refunded: {
    amount: {
      type: Number,
      default: 0
    },
    currency: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  failed_data: String,
  invoice: {
    quantity: Number,
    product_id: String,
    setup_fee: Number,
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
    order_number: String,
    expiry_date: Date,
    cron_process: String,
    current_tracking_id: String,
    paid_date: Date,
    retry: Boolean,
    retry_count: Number,
    createdAt: Date,
    updatedAt: Date,
    id: String,
    customer_id: String,
    user_id: String,
    subscription_id: String,
    status: String,
    invoice_id: String,
    payment_term: String,
    amount: Number,
    due_amount: Number,
    due_date: Date,
    plan_id: [String],
    subscription: mongoose.Schema.Types.Mixed,
    product: mongoose.Schema.Types.Mixed,
    invoice_link: String
  },
  subscription: mongoose.Schema.Types.Mixed,
  user: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ createdAt: 1, status: 1 });
transactionSchema.index({ product_id: 1, createdAt: 1 });
transactionSchema.index({ plan_id: 1, createdAt: 1 });
transactionSchema.index({ customer_id: 1, createdAt: 1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ 'refunded.amount': 1 });

export default mongoose.model('Transaction', transactionSchema);

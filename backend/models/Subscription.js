import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  customer_id: {
    type: String,
    required: true,
    index: true
  },
  email_id: {
    type: String,
    required: true,
    index: true
  },
  product_id: {
    type: String,
    required: true,
    index: true
  },
  plan_id: {
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
    enum: ['live', 'cancelled', 'expired', 'trial'],
    index: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true,
    index: true
  },
  starts_at: {
    type: Date,
    required: true,
    index: true
  },
  activation_date: {
    type: Date,
    index: true
  },
  expiry_date: {
    type: Date,
    index: true
  },
  trial_days: {
    type: Number,
    default: 0
  },
  trial_expiry_date: Date,
  next_billing_date: {
    type: Date,
    index: true
  },
  last_billing_date: {
    type: Date,
    index: true
  },
  canceled_date: {
    type: Date,
    index: true
  },
  setup_fee: {
    type: Number,
    default: 0
  },
  currency_code: String,
  currency_symbol: String,
  pcustomer_id: String,
  payment_method: String,
  taxable: {
    type: Boolean,
    default: false
  },
  taxrule_id: String,
  tax_apply: {
    id: String,
    country: String,
    taxes: mongoose.Schema.Types.Mixed,
    record_tax_id: Boolean,
    state: String,
    validate_tax_in: Boolean,
    tax_id: String,
    exempt_tax: []
  },
  gateway_type: String,
  payment_terms: String,
  gateway_id: String,
  gateway_name: String,
  custom_gateway_type: String,
  custom_fields: [{
    name: String,
    type: String,
    label: String,
    value: String
  }],
  custom: mongoose.Schema.Types.Mixed,
  funnel: [],
  requested_ip: String,
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
  customer: {
    billing_address: {
      street1: String,
      city: String,
      state: String,
      state_code: String,
      zip_code: String,
      country: String
    },
    shipping_address: {
      street1: String,
      city: String,
      state: String,
      state_code: String,
      zip_code: String,
      country: String
    },
    other_detail: mongoose.Schema.Types.Mixed,
    role: String,
    credit: {
      remaining: Number
    },
    api: String,
    portal_status: Boolean,
    set_password: {
      invite: String,
      forget_password_key: String
    },
    pcustomer_id: String,
    phone: String,
    tax_id: String,
    createdAt: Date,
    updatedAt: Date,
    id: String,
    user_id: String,
    first_name: String,
    last_name: String,
    user_name: String,
    email_id: String
  },
  plan: {
    plan_type: String,
    min_quantity: Number,
    max_quantity: Number,
    plan_active: String,
    redirect_url: String,
    specific_keep_live: Boolean,
    meta_data: mongoose.Schema.Types.Mixed,
    currency_code: String,
    currency_symbol: String,
    gateways_array: [String],
    payment_gateway: String,
    failed_payment_gateway_array: [String],
    failed_payment_gateway: String,
    trial_type: String,
    trial_amount: Number,
    funnel_count: String,
    funnel: [],
    custom_payment_term: Number,
    is_metered: Boolean,
    setup_fee_type: String,
    createdAt: Date,
    updatedAt: Date,
    id: String,
    product_id: String,
    user_id: String,
    plan_name: String,
    plan_code: String,
    price: Number,
    billing_period: String,
    billing_period_num: String,
    billing_cycle: String,
    billing_cycle_num: String,
    trial_period: Number,
    setup_fee: Number,
    plan_description: String
  }
}, {
  timestamps: true
});

// Indexes for performance
subscriptionSchema.index({ createdAt: 1, status: 1 });
subscriptionSchema.index({ product_id: 1, createdAt: 1 });
subscriptionSchema.index({ plan_id: 1, createdAt: 1 });
subscriptionSchema.index({ customer_id: 1, createdAt: 1 });
subscriptionSchema.index({ status: 1, starts_at: 1 });
subscriptionSchema.index({ status: 1, expiry_date: 1 });

export default mongoose.model('Subscription', subscriptionSchema);

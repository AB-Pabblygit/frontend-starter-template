import { useState } from 'react';

import { Box, Card, Button, InputLabel, FormControl, MenuItem, Select, Typography } from '@mui/material';

// Products & Plans data matching HTML
const PRODUCTS = [
  { id: 'pem', name: 'Email Marketing', plans: [
    { id: 'pem-starter', name: 'Starter', price: 29 },
    { id: 'pem-basic', name: 'Basic', price: 49 },
    { id: 'pem-pro', name: 'Pro', price: 149 },
    { id: 'pem-enterprise', name: 'Enterprise', price: 499 },
  ]},
  { id: 'psb', name: 'Subscription Billing', plans: [
    { id: 'psb-starter', name: 'Starter', price: 9 },
    { id: 'psb-basic', name: 'Basic', price: 19 },
    { id: 'psb-pro', name: 'Pro', price: 79 },
    { id: 'psb-enterprise', name: 'Enterprise', price: 399 },
  ]},
  { id: 'pc', name: 'Connect', plans: [
    { id: 'pc-starter', name: 'Starter', price: 4 },
    { id: 'pc-basic', name: 'Basic', price: 9 },
    { id: 'pc-pro', name: 'Pro', price: 29 },
    { id: 'pc-enterprise', name: 'Enterprise', price: 199 },
  ]},
  { id: 'pfb', name: 'Form Builder', plans: [
    { id: 'pfb-starter', name: 'Starter', price: 4 },
    { id: 'pfb-basic', name: 'Basic', price: 7 },
    { id: 'pfb-pro', name: 'Pro', price: 39 },
    { id: 'pfb-enterprise', name: 'Enterprise', price: 129 },
  ]},
];

export function AnalyticsSimulator({ customers = [], events = [], onAction, onGenerateCustomers }) {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedAction, setSelectedAction] = useState('signup');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  // Debug: Log customers to console
  console.log('Simulator customers:', customers);

  const availablePlans = selectedProduct 
    ? PRODUCTS.find(p => p.id === selectedProduct)?.plans || []
    : [];

  const handleReset = () => {
    // Clear simulated customers to fall back to original analytics data
    onGenerateCustomers([]);
    
    // Reset form selections
    setSelectedCustomer('');
    setSelectedAction('signup');
    setSelectedProduct('');
    setSelectedPlan('');
  };

  const handleApply = () => {
    if (!onAction) return;
    
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    
    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;
    
    const productId = selectedProduct;
    const planId = selectedPlan;
    
    onAction(selectedAction, customer, { productId, planId, nowStr });
    
    // Reset form
    setSelectedCustomer('');
    setSelectedAction('signup');
    setSelectedProduct('');
    setSelectedPlan('');
  };

  const handleGenerateCustomers = () => {
    const firstNames = ['Emma','Liam','Olivia','Noah','Ava','Ethan','Sophia','Mason','Isabella','William','Mia','James','Charlotte','Oliver','Amelia','Benjamin','Harper','Lucas','Evelyn','Henry','Abigail','Alexander','Emily','Michael','Elizabeth','Daniel','Sofia','Matthew','Avery','Jackson','Ella','Sebastian','Scarlett','David','Grace','Joseph','Chloe','Carter','Victoria','Owen','Riley','Luke','Aria','Gabriel','Lily','Anthony','Aubrey','Dylan','Zoey','Samuel'];
    const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter'];
    
    const count = Math.floor(Math.random() * 11) + 5; // 5-15
    const newCustomers = Array.from({ length: count }).map((_, idx) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*99)}@${['gmail.com','yahoo.com','outlook.com','company.com','business.org'][Math.floor(Math.random()*5)]}`;
      
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const plan = product.plans[Math.floor(Math.random() * product.plans.length)];
      
      const id = `c${Date.now()}_${idx}`;
      const now = new Date();
      const monthsAgo = Math.floor(Math.random() * 12) + 1;
      const signupDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.floor(Math.random() * 28) + 1);
      
      return {
        id,
        name: `${firstName} ${lastName}`,
        email,
        status: 'active',
        signupDate: signupDate.toISOString().split('T')[0],
        planId: plan.id,
        productId: product.id,
        monthlyRevenue: plan.price,
        subscriptions: [{
          id: `s${id}_1`,
          productId: product.id,
          planId: plan.id,
          monthly: plan.price,
          start: signupDate.toISOString().split('T')[0],
          end: null,
          active: true
        }],
        transactions: Array.from({ length: monthsAgo }, (_, index) => ({
          date: new Date(signupDate.getFullYear(), signupDate.getMonth() + index, signupDate.getDate()).toISOString().split('T')[0],
          amount: plan.price,
          type: 'invoice',
          refunded: false
        }))
      };
    });
    onGenerateCustomers([...(customers || []), ...newCustomers]);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
      {/* Event Log */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Event Log</Typography>
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          {events.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No events yet. Use the simulator to create transactions.
            </Typography>
          ) : (
            events.map((event) => (
              <Box key={event.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {event.timestamp}
                </Typography>
                <Typography variant="body2">{event.details}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Card>

      {/* Simulator Controls */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Simulator</Typography>

        <Box sx={{ display: 'grid', gap: 2.5 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Customer</InputLabel>
            <Select label="Customer" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
              <MenuItem value="">— Select customer —</MenuItem>
              <MenuItem value="__new__">Create new customer</MenuItem>
              {(customers || []).map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {`${c.name || c.firstName || 'Customer'} — ${c.email || 'no-email@example.com'}`}
                </MenuItem>
              ))}
              {(customers || []).length === 0 && (
                <MenuItem value="__no_customers__" disabled>
                  No customers available - Use original analytics data
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Action</InputLabel>
            <Select label="Action" value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
              <MenuItem value="signup">New Signup</MenuItem>
              <MenuItem value="upgrade">Upgrade Plan</MenuItem>
              <MenuItem value="downgrade">Downgrade Plan</MenuItem>
              <MenuItem value="cancel">Full Cancellation</MenuItem>
              <MenuItem value="refund">Process Refund</MenuItem>
              <MenuItem value="reactivate">Reactivate</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Product</InputLabel>
            <Select 
              label="Product" 
              value={selectedProduct} 
              onChange={(e) => { 
                setSelectedProduct(e.target.value); 
                setSelectedPlan(''); 
              }}
            >
              <MenuItem value="">Select product</MenuItem>
              {PRODUCTS.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Plan</InputLabel>
            <Select 
              label="Plan" 
              value={selectedPlan} 
              onChange={(e) => setSelectedPlan(e.target.value)}
              disabled={!selectedProduct}
            >
              <MenuItem value="">Select plan</MenuItem>
              {availablePlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} (${plan.price}/mo)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="success" onClick={handleApply}>
            Apply Action
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleReset}>Reset</Button>
        </Box>
      </Card>
    </Box>
  );
}

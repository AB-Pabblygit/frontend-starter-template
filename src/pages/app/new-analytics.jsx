import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Tab, Tabs, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import PageHeader from 'src/components/page-header/page-header';
import ErrorBoundary from 'src/components/error-boundary/error-boundary';

import { CustomerListsTable } from './components/customer-lists-table';
import { PAYMENT_SOURCE, AnalyticsPaymentTable } from './components/analytics-payment-table';
import { AnalyticsConsolidatedTable } from './components/analytics-consolidated-table';

const metadata = { title: `Analytics Dashboard | ${CONFIG.site.name}` };

export default function NewAnalyticsPage() {
  const [currentTab, setCurrentTab] = useState('payment-table');

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  const TABS = [
    { value: 'payment-table', label: 'Expanded Data' },
    { value: 'customer-table', label: 'Consolidated Data' },
  ];

  // Shared filters
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedPlan, setSelectedPlan] = useState('All');

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthOptions = monthNames.map((m, idx) => ({ label: m, value: idx }));
  const productOptions = ['All', ...Array.from(new Set(PAYMENT_SOURCE.map(r => r.product)))];
  const planOptions = ['All', ...Array.from(new Set(PAYMENT_SOURCE.filter(r => selectedProduct === 'All' || r.product === selectedProduct).map(r => r.plan)))];
  const yearOptions = Array.from(new Set([
    ...PAYMENT_SOURCE
      .map(r => r.paymentDate)
      .filter(Boolean)
      .map(d => new Date(d).getFullYear()),
    now.getFullYear()
  ])).sort();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ErrorBoundary>
        <DashboardContent maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <PageHeader 
              title="Analytics Dashboard" 
              Subheading="MRR & Churn Analytics" 
              link_added="" 
            />
          </Box>

          {/* Shared Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="month-label">Month</InputLabel>
              <Select labelId="month-label" label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {monthOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-label">Year</InputLabel>
              <Select labelId="year-label" label="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {yearOptions.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="product-label">Product</InputLabel>
              <Select labelId="product-label" label="Product" value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value); setSelectedPlan('All'); }}>
                {productOptions.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="plan-label">Plan</InputLabel>
              <Select labelId="plan-label" label="Plan" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                {planOptions.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Two-tab layout with filters affecting content */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {currentTab === 'payment-table' && (
              <AnalyticsPaymentTable 
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedProduct={selectedProduct}
                selectedPlan={selectedPlan}
              />
            )}
            {currentTab === 'customer-table' && (
              <AnalyticsConsolidatedTable 
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedProduct={selectedProduct}
                selectedPlan={selectedPlan}
              />
            )}
          </Box>
        </DashboardContent>
      </ErrorBoundary>
    </>
  );
}
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Tab, Tabs, Alert, Select, MenuItem, useTheme, InputLabel, FormControl, CircularProgress } from '@mui/material';

import { checkAnalyticsAPI, checkBackendHealth } from 'src/utils/backend-health';
import { validateApiResponse, validateAnalyticsData } from 'src/utils/validation';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';
import analyticsApi from 'src/services/analyticsApi';
import { realisticAnalyticsService } from 'src/_mock/_database';

import { Iconify } from 'src/components/iconify';
import PageHeader from 'src/components/page-header/page-header';
import ErrorBoundary from 'src/components/error-boundary/error-boundary';

import { AnalyticsTables } from './components/analytics-tables';
import { AnalyticsPlanChips } from './components/analytics-plan-chips';
import { CustomerListsTable } from './components/customer-lists-table';
import { AnalyticsStatsCards } from './components/analytics-stats-cards';

// ----------------------------------------------------------------------

const metadata = { title: `Customer MRR & Churn Analytics | ${CONFIG.site.name}` };

export default function AnalyticsPage() {
  const theme = useTheme();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString()); // 1-12
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedPlan, setSelectedPlan] = useState('All Plans');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('active-customers');

  // Available products and plans (using actual product/plan IDs)
  const products = [
    'All Products',
    '5e6624827e5eb40f41789173', // Email Marketing
    '5e6624827e5eb40f41789174', // Subscription Billing
    '5e6624827e5eb40f41789175', // Form Builder
    '5e6624827e5eb40f41789176'  // Connect
  ];

  const plans = [
    'All Plans',
    '673b2a92de8bd6206516d5c5', // Basic
    '673b2a92de8bd6206516d5c6', // Pro
    '673b2a92de8bd6206516d5c7', // Premium
    '673b2a92de8bd6206516d5c8'  // Enterprise
  ];

  // Handle filter changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build filters for backend API
        const monthStr = selectedMonth.padStart(2, '0');
        const filters = {
          startDate: `${selectedYear}-${monthStr}-01`,
          endDate: `${selectedYear}-${monthStr}-31`,
          ...(selectedProduct !== 'All Products' && { productId: selectedProduct }),
          ...(selectedPlan !== 'All Plans' && { planId: selectedPlan }),
        };

        // Try to get analytics data from backend API first
        try {
          const response = await analyticsApi.getAllAnalytics(filters);
          
          // Validate API response
          validateApiResponse(response);
          
          if (response.success) {
            // Validate analytics data
            validateAnalyticsData(response.data);
            setAnalyticsData(response.data);
          } else {
            throw new Error(response.error || 'Failed to fetch analytics data');
          }
        } catch (apiError) {
          // If backend API fails, check backend health and fallback to mock data
          if (process.env.NODE_ENV === 'development') {
            console.warn('Backend API unavailable, using mock data:', apiError.message);
            
            // Check backend health for debugging
            const backendHealth = await checkBackendHealth();
            const apiHealth = await checkAnalyticsAPI();
            console.log('Backend Health:', backendHealth);
            console.log('Analytics API Health:', apiHealth);
          }
          
          // Use mock data as fallback
          const mockData = realisticAnalyticsService.getAllAnalytics(filters);
          setAnalyticsData(mockData);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics fetch error:', err);
        }
        setError(err.message || 'Failed to load analytics data');
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedProduct, selectedPlan, selectedMonth, selectedYear]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getCustomerDataForTab = () => {
    if (!analyticsData?.customers) return [];

    const { customers } = analyticsData;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (currentTab) {
      case 'new-customers':
        return customers.filter((customer) => {
          const signupDate = new Date(customer.signupDate);
          return signupDate >= thisMonthStart;
        });
      
      case 'refunded-customers':
        return customers.filter((customer) => {
          const hasRefund = analyticsData.invoices?.some(
            (invoice) => invoice.customerId === customer.id && invoice.status === 'refunded'
          );
          return hasRefund;
        });
      
      case 'churned-customers':
        return customers.filter((customer) => customer.status === 'cancelled');
      
      case 'active-customers':
        return customers.filter((customer) => customer.status === 'active');
      
      case 'all-customers':
        return customers;
      
      default:
        return [];
    }
  };

  const TABS = [
    {
      value: 'active-customers',
      label: 'Active',
      icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
    },
    {
      value: 'new-customers',
      label: 'New Customers',
      icon: <Iconify icon="solar:user-plus-bold" width={24} />,
    },
    {
      value: 'refunded-customers',
      label: 'Refund',
      icon: <Iconify icon="solar:money-bag-bold" width={24} />,
    },
    {
      value: 'churned-customers',
      label: 'Churn',
      icon: <Iconify icon="solar:user-minus-bold" width={24} />,
    },
    {
      value: 'all-customers',
      label: 'All Customers',
      icon: <Iconify icon="solar:users-group-two-rounded-bold" width={24} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ErrorBoundary>
        <DashboardContent maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <PageHeader
            title="Customer MRR & Churn Analytics"
            Subheading=""
            link_added=""
          />
          
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 120,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.grey[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[
                  { value: '1', label: 'January' },
                  { value: '2', label: 'February' },
                  { value: '3', label: 'March' },
                  { value: '4', label: 'April' },
                  { value: '5', label: 'May' },
                  { value: '6', label: 'June' },
                  { value: '7', label: 'July' },
                  { value: '8', label: 'August' },
                  { value: '9', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' },
                ].map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 120,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.grey[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Array.from({ length: 6 }, (_, i) => {
                  const year = currentDate.getFullYear() - i;
                  return (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.grey[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct}
                label="Product"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <MenuItem value="All Products">All Products</MenuItem>
                <MenuItem value="5e6624827e5eb40f41789173">Pabbly Email Marketing</MenuItem>
                <MenuItem value="5e6624827e5eb40f41789174">Pabbly Subscription Billing</MenuItem>
                <MenuItem value="5e6624827e5eb40f41789175">Pabbly Form Builder</MenuItem>
                <MenuItem value="5e6624827e5eb40f41789176">Pabbly Connect</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.grey[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <InputLabel>Plan</InputLabel>
              <Select
                value={selectedPlan}
                label="Plan"
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <MenuItem value="All Plans">All Plans</MenuItem>
                <MenuItem value="673b2a92de8bd6206516d5c5">Basic</MenuItem>
                <MenuItem value="673b2a92de8bd6206516d5c6">Pro</MenuItem>
                <MenuItem value="673b2a92de8bd6206516d5c7">Premium</MenuItem>
                <MenuItem value="673b2a92de8bd6206516d5c8">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Stats Cards Grid */}
        {!loading && (
          <AnalyticsStatsCards analyticsData={analyticsData} />
        )}

        {/* Plan Performance Chips */}
        {!loading && (
          <AnalyticsPlanChips analyticsData={analyticsData} />
        )}

        {/* Analytics Tables */}
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <AnalyticsTables analyticsData={analyticsData} />
          </Box>
        )}

        {/* Tabs for Tables */}
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                />
              ))}
            </Tabs>

            {/* Customer Lists Tables */}
            <CustomerListsTable 
              customers={getCustomerDataForTab()}
              tabType={currentTab}
              loading={loading}
            />
          </Box>
        )}
        </DashboardContent>
      </ErrorBoundary>
    </>
  );
}

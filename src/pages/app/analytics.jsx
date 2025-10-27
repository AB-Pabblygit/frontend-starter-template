import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Alert, Select, MenuItem, useTheme, InputLabel, FormControl, CircularProgress } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { checkAnalyticsAPI, checkBackendHealth } from 'src/utils/backend-health';
import { validateApiResponse, validateAnalyticsData } from 'src/utils/validation';
import { DashboardContent } from 'src/layouts/app';

import { realisticAnalyticsService } from 'src/_mock/_database';
import analyticsApi from 'src/services/analyticsApi';

import PageHeader from 'src/components/page-header/page-header';
import ErrorBoundary from 'src/components/error-boundary/error-boundary';

import { AnalyticsStatsCards } from './components/analytics-stats-cards';
import { CustomerDetailsDrawer } from './components/customer-details-drawer';
import { CustomerDetailsTable } from './components/customer-details-table';
import { StatsSummaryTable } from './components/stats-summary-table';

// ----------------------------------------------------------------------

const metadata = { title: `Customer MRR & Churn Analytics | ${CONFIG.site.name}` };

export default function AnalyticsPage() {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Current month in YYYY-MM format
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedPlan, setSelectedPlan] = useState('All Plans');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const filters = {
          startDate: `${selectedMonth}-01`,
          endDate: `${selectedMonth}-31`,
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
            return; // Success, exit early
          }
          throw new Error(response.error || 'Failed to fetch analytics data');
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
  }, [selectedProduct, selectedPlan, selectedMonth]);


  const handleViewCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
  };

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
                minWidth: 150,
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
                    {Array.from({ length: 6 }, (_, i) => {
                      const monthDate = new Date();
                      monthDate.setMonth(monthDate.getMonth() - i);
                      const monthValue = monthDate.toISOString().slice(0, 7);
                      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      return (
                        <MenuItem key={monthValue} value={monthValue}>
                          {monthName}
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


        {/* Stats Summary Table */}
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <StatsSummaryTable analyticsData={analyticsData} />
          </Box>
        )}

        {/* Customer Details Table */}
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <CustomerDetailsTable 
              onViewCustomer={handleViewCustomer}
              analyticsData={analyticsData}
            />
          </Box>
        )}
        </DashboardContent>

        {/* Customer Details Drawer */}
        <CustomerDetailsDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          customerData={selectedCustomer}
        />
      </ErrorBoundary>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Tabs, Tab, useTheme } from '@mui/material';
import { DashboardContent } from 'src/layouts/app';

import { realisticAnalyticsService } from 'src/_mock/_database';
import analyticsApi from 'src/services/analyticsApi';

import PageHeader from 'src/components/page-header/page-header';
import ErrorBoundary from 'src/components/error-boundary/error-boundary';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';

import { CustomerListsTable } from './components/customer-lists-table';

// ----------------------------------------------------------------------

const metadata = { title: `Customer Lists | ${CONFIG.site.name}` };

export default function CustomerListsPage() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('new-customers');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const filters = {};
        try {
          const response = await analyticsApi.getAllAnalytics(filters);
          if (response.success) {
            setAnalyticsData(response.data);
            return;
          }
        } catch (apiError) {
          // Fallback to mock data
          const mockData = realisticAnalyticsService.getAllAnalytics(filters);
          setAnalyticsData(mockData);
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TABS = [
    {
      value: 'new-customers',
      label: 'New Customers',
      icon: <Iconify icon="solar:user-plus-bold" width={24} />,
      description: 'Customers who joined this month',
    },
    {
      value: 'refunded-customers',
      label: 'Refunded Customers',
      icon: <Iconify icon="solar:money-bag-bold" width={24} />,
      description: 'Customers who received refunds',
    },
    {
      value: 'churned-customers',
      label: 'Churned/Lost Customers',
      icon: <Iconify icon="solar:user-minus-bold" width={24} />,
      description: 'Customers who cancelled or left',
    },
    {
      value: 'active-customers',
      label: 'Active Customers',
      icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
      description: 'Currently active customers',
    },
    {
      value: 'all-customers',
      label: 'All Customers',
      icon: <Iconify icon="solar:users-group-two-rounded-bold" width={24} />,
      description: 'View all customers',
    },
  ];

  const getCustomerDataForTab = () => {
    if (!analyticsData?.customers) return [];

    const customers = analyticsData.customers;
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
      default:
        return customers;
    }
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ErrorBoundary>
        <DashboardContent maxWidth="xl">
          <PageHeader
            title="Customer Lists"
            Subheading="Manage and view different categories of customers"
            link_added=""
          />

          <Box sx={{ mt: 3 }}>
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

            <CustomerListsTable 
              customers={getCustomerDataForTab()}
              tabType={currentTab}
              loading={loading}
            />
          </Box>
        </DashboardContent>
      </ErrorBoundary>
    </>
  );
}

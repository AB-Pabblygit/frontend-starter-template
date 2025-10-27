import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { AppLayout } from 'src/layouts/app';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const Dashboard = lazy(() => import('src/pages/app/dashboard'));

const Analytics = lazy(() => import('src/pages/app/analytics'));

const CustomerLists = lazy(() => import('src/pages/app/customer-lists'));

const GetHelp = lazy(() => import('src/pages/app/get-help'));

const Settings = lazy(() => import('src/pages/app/settings'));

const ActivityLog = lazy(() => import('../../app-sections/settings-page/activity-log'));
const TimeZone = lazy(() => import('../../app-sections/settings-page/time-zone'));
const Api = lazy(() => import('../../app-sections/settings-page/api'));
const TeamMembers = lazy(() => import('../../app-sections/settings-page/team-members'));

// ----------------------------------------------------------------------

const layoutContent = (
  <AppLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AppLayout>
);

export const appRoutes = [
  {
    path: 'app',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <Dashboard />, index: true },

      { path: 'analytics', element: <Analytics /> },

      { path: 'customer-lists', element: <CustomerLists /> },

      { path: 'get-help', element: <GetHelp /> },

      {
        path: 'settings',
        element: <Settings />,
        children: [
          { path: 'timezone', element: <TimeZone /> },
          { path: 'activity-log', element: <ActivityLog /> },
          { path: 'api', element: <Api /> },
          { path: 'team-members', element: <TeamMembers /> },
        ],
      },
    ],
  },
];

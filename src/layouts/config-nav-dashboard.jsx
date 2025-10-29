import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const appicon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/app/${name}.svg`} />
);
const adminicon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/admin/${name}.svg`} />
);

const APPICONS = {
  dashboard: appicon('ic-dashboard'),
  analytics: appicon('ic-ecommerce'),
  requests: appicon('ic-requests'),
  events: appicon('ic-events'),
  transformations: appicon('ic-transformations'),
  two: appicon('ic-ecommerce'),
  settings: appicon('ic-settings'),
  gethelp: appicon('ic-gethelp'),
};
const ADMINICONS = {
  connections: adminicon('ic-connections'),
  settings: adminicon('ic-settings'),
};

// ----------------------------------------------------------------------

export const appNavData = [
  /**
   * Overview
   */
  {
    items: [
      { title: 'Dashboard', path: paths.app.root, icon: APPICONS.dashboard },
      { title: 'Analytics', path: paths.app.analytics, icon: APPICONS.analytics },
      { title: 'New Analytics', path: paths.app.newAnalytics, icon: APPICONS.two },
    ],
  },

  {
    items: [
      {
        title: 'Settings',
        path: paths.app.settings.root,
        icon: APPICONS.settings,
        children: [
          { title: 'API', path: paths.app.settings.api },
          { title: 'Team Members', path: paths.app.settings.teamMembers },
          { title: 'Activity Log', path: paths.app.settings.activityLog },
          { title: 'Time Zone', path: paths.app.settings.timezone },
        ],
      },
    ],
  },
  {
    items: [{ title: 'Get Help', path: paths.app.gethelp, icon: APPICONS.gethelp }],
  },
];

export const adminNavData = [
  {
    items: [{ title: 'Connections', path: paths.admin.root, icon: ADMINICONS.connections }],
  },
  {
    items: [
      {
        title: 'Settings',
        path: paths.admin.settings.root,
        icon: ADMINICONS.settings,
        children: [
          // { title: 'Integrations', path: paths.admin.settings.integratedApps },
          { title: 'Email Notifications', path: paths.admin.settings.emailNoti },
          { title: 'Activity Log', path: paths.admin.settings.activitylog },
        ],
      },
    ],
  },
];

// Helper function to get the correct nav data based on the route
export const getNavData = (pathname) => {
  if (pathname.startsWith('/admin')) {
    return adminNavData;
  }
  return appNavData;
};

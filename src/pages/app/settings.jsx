

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import { Iconify } from 'src/components/iconify';
import CustomTabs from 'src/components/custom-tabs/custom-tabs';

// ----------------------------------------------------------------------

const metadata = { title: `Page Settings | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const EXAMPLE_TABS = [
    {
      value: 'api',
      path: '/app/settings/api',
      icon: <Iconify icon="pajamas:api" width={24} />,
      label: 'API & Webhooks',
      tooltip: 'Get API key and you can add a webhook URL to receive event notifications..',
      pageTitle: 'API',
      pageSubheading:
        'Get your API and Secret Key for secure authentication. Ensure these keys remain confidential. ',
      link: 'https://forum.pabbly.com/threads/what-is-pabbly-hook-api-and-secret-key.25709/',
    },
    {
      value: 'team-members',
      path: '/app/settings/team-members',
      icon: <Iconify icon="fluent:people-team-28-filled" width={24} />,
      label: 'Team Members',
      tooltip: 'Add team members and share folder(s) access with them.',
      pageTitle: 'Team Members',
      pageSubheading: 'Add team members and share folder(s) access with them from here. ',
      link: 'https://forum.pabbly.com/threads/what-is-team-members-in-pabbly-hook.26905/',
    },
  
   
    {
      value: 'activity-log',
      path: '/app/settings/activity-log',
      icon: <Iconify icon="material-symbols:work-history" width={24} />,
      label: 'Activity Log',
      tooltip:
        'Activity Log helps you monitor changes and keep track of all actions in your Pabbly Hook account.',
      pageTitle: 'Activity Log',
      pageSubheading:
        'Keep track of all actions in your Pabbly Hook account, like add connection, add transformation, adding team members, and regenerating API keys. Activity Log helps you monitor changes and ensure everything runs smoothly. ',
      link: 'https://forum.pabbly.com/threads/what-is-activity-log-pabbly-hook.26906/',
    },
    {
      value: 'timezone',
      path: '/app/settings/timezone',
      icon: <Iconify icon="icons8:tasks" width={24} />,
      label: 'Time Zone',
      tooltip: 'Choose time zone',
      pageTitle: 'Time Zone',
      pageSubheading: "Select your account's time zone to ensure connections, requests, events and transformations are displayed at the correct time for your location. ",
      link:'https://forum.pabbly.com/threads/what-is-time-zone-in-pabbly-hook.25658/'
    },
  
   
    // ... more tabs
  ];
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <CustomTabs
          tabs={EXAMPLE_TABS}
          defaultTab="timezone"
          defaultPath="/app/settings/timezone"
          dashboardContentProps={{ maxWidth: 'xl' }}
        />
      </DashboardContent>
    </>
  );
}

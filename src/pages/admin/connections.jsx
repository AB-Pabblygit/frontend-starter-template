import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import { Box, useMediaQuery } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';
import { ConnectionsBigCard } from 'src/_mock/_big-card/_admin/_connectionsBigCardItems';
import { ConnectionsTable } from 'src/admin-sections/connections/components/table/connections-table';

import BigCard from 'src/components/big-card/big-card';
import StatsCards from 'src/components/stats-card/stats-card';
import PageHeader from 'src/components/page-header/page-header';

// ----------------------------------------------------------------------

const metadata = { title: `Connections | ${CONFIG.site.name}` };
const { items, style } = ConnectionsBigCard;

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Modified handler for opening dialog
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            mb: 5,
          }}
        >
          <PageHeader
            title="Connections"
            Subheading="Access and manage all connections created by Pabbly customers, with the ability to view detailed information about individual customers."
            link_added="https://forum.pabbly.com/threads/what-is-a-connection-in-pabbly-hook.25651/"
          />
        </Box>
        <Box
          sx={{
            mb: '24px',
            gap: 3,
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
          }}
        >
          <StatsCards
            cardtitle="Total Connections"
            cardstats="5"
            icon_name="connection-added.svg"
            icon_color="#FFA92E"
            bg_gradient="#FFA92E"
            tooltip="Total number of connections."
          />

          <StatsCards
            cardtitle="Active Connections"
            cardstats="1"
            icon_name="active-connection.svg"
            icon_color="#28A645"
            bg_gradient="#22C55E"
            tooltip="Total number of active connections."
          />

          <StatsCards
            cardtitle="Inactive Connections"
            cardstats="1"
            icon_name="inactive-connection.svg"
            icon_color="#B71D18"
            bg_gradient="#B71D18"
            tooltip="Total number of inactive connections."
          />

          <StatsCards
            cardtitle="Blocked Connections"
            cardstats="1"
            icon_name="blocked-connection.svg"
            icon_color="#1D88FA"
            bg_gradient="#1D88FA"
            tooltip="Total number of blocked connections."
          />
        </Box>
        <Box width="100%" sx={{ mb: '24px' }}>
          <Box>
            <BigCard
              getHelp={false}
              isVideo
              bigcardtitle="Points To Remember"
              style={style}
              items={items}
              videoLink="https://www.youtube.com/embed/YBEA1SjtwQ0?si=TWN5meKNkJCfmGk2"
              thumbnailName="pabbly-hook-admin.png"
              learnMoreLink='https://forum.pabbly.com/threads/what-is-a-connection-in-pabbly-hook.25651/'
            />
          </Box>
        </Box>
        <ConnectionsTable />
      </DashboardContent>
    </>
  );
}

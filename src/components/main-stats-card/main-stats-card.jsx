import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';

import { Box, Skeleton } from '@mui/material';

import StatsCards from '../stats-card/stats-card';

export default function MainStatsCard() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);
  return (
    <Box
  
      sx={{
        mt: '40px',
        gap: 3,
        display: 'grid',
        flexWrap: 'wrap',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
      }}
    >
      <StatsCards
        cardtitle="Events Allotted"
        cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '10000'}
        icon_name="alloted.png"
        icon_color="#FFA92E"
        tooltip="Total number of events allotted to your account."
        bg_gradient="#FFA92E"
      />

      <StatsCards
        cardtitle="Events Consumed"
        cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '2000'}
        tooltip="Total number of events consumed by your account."
        icon_name="consumed.svg"
        icon_color="#10CBF3"
        bg_gradient="#10CBF3"
      />

      <StatsCards
        cardtitle="Events Remaining"
        tooltip="Total number of events remaining in your account."
        cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '8000'}
        icon_name="remaining.svg"
        icon_color="#1D88FA"
        bg_gradient="#1D88FA"
      />

      <StatsCards
        cardtitle="Total Connections Added"
        tooltip="Total number of connections in your account."
        cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '210'}
        icon_name="added.svg"
        icon_color="#28A645"
        bg_gradient="#22C55E"
      />
    </Box>
  );
}

import { useTheme } from '@emotion/react';

import { Box, Typography } from '@mui/material';

import LearnMoreLink from '../learn-more-link/learn-more-link';

export default function PageHeader({ title, Subheading, link_added }) {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        {Subheading}{' '}
        
        <LearnMoreLink
              link={link_added}
            />
        {/* <Link style={{ color: '#0c68e9' }} underline="always" target='blank' to={link_added}>
          Learn more
        </Link> */}
      </Typography>
    </Box>
  );
}

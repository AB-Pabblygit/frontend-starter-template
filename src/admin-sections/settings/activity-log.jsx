import { Helmet } from 'react-helmet-async';

import { Box, Grid } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { listItemsActivityLog } from 'src/_mock/_big-card/_admin/_activitylogBigCardItems';

import BigCard from 'src/components/big-card/big-card';

import { ActivityLogTable } from '../activity-log/components/table/activity-log-table';

// ----------------------------------------------------------------------

const metadata = { title: `Activity Log | ${CONFIG.site.name}` };

export default function Page() {
  const { items, style } = listItemsActivityLog;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Box sx={{ mt: 4 }}>
        <Grid mt={3} xs={12} md={8} mb={3}>
          <BigCard
            tooltip="View file upload guidelines for Hook."
            getHelp={false}
            isVideo
            bigcardtitle="Points To Remember"
            style={style}
            items={items}
            videoLink="https://www.youtube.com/embed/YBEA1SjtwQ0?si=TWN5meKNkJCfmGk2"
            thumbnailName="activity-log-pabbly-hook.png"
            learnMoreLink="https://forum.pabbly.com/threads/what-is-activity-log-pabbly-hook.26906/"
          />
        </Grid>
        <ActivityLogTable />
      </Box>
    </>
  );
}

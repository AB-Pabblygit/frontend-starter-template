import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Avatar,
  Button,
  Divider,
  Tooltip,
  CardHeader,
  Typography,
  AvatarGroup,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const metadata = { title: `Time-Zone | ${CONFIG.site.name}` };

export default function ShareWorkflow() {
  const sharerer_name = 'Name';
  const workflow_name =
    'How to Share Instagram Posts On Discord | Instagram to Discord';
    const created_at='Created at 2025-01-03 17:00:03';
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                {/* <Tooltip
                  title="Choose the time zone for your account. All dates and times will align with this setting."
                  disableInteractive
                  arrow
                  placement="top"
                > */}
                <span>{sharerer_name} has shared a workflow</span>
                {/* </Tooltip> */}
              </Typography>
            }
            subheader='Click "Try now" to clone this ready-to-use workflow & start automating your tasks with Pabbly Connect!'
            sx={{ mb: 3 }}
          />
          <Divider />
          <Box display="flex" sx={{ p: 3 ,flexDirection:{xs:'column',sm:'row'}}} gap={3} alignItems="start">
            <Box display="flex">
              <Tooltip title="Integrated applications" disableInteractive placement="top" arrow>
                <AvatarGroup variant="rounded">
                  <Avatar
                    alt="app1"
                    sx={{ padding: 1, width: '32px', height: '32px', backgroundColor: '#EDEFF2' }}
                    src="https://s3.us-west-2.amazonaws.com/connect.pabbly/images/1716893841-Instagram.png"
                  />
                  <Avatar
                    alt="app2"
                    sx={{
                      padding: 1,
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#EDEFF2',
                    }}
                    src="https://d23j5fl26hha5c.cloudfront.net/images/1627534442283_1628923887-discord.png"
                  />
                </AvatarGroup>
              </Tooltip>
            </Box>
            <Box>
              <Typography variant="h6">
                <Tooltip title={workflow_name} disableInteractive placement="top" arrow>
                  <span>{workflow_name}</span>
                </Tooltip>
              </Typography>
              <Typography fontSize={14} color="text.disabled">
                {created_at}
              </Typography>
            </Box>
          </Box>
          <Box px={3} mb={3}>
            <Button color="primary" variant="contained">
              Try Now
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

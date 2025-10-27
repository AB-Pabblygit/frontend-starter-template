import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Button, Tooltip, Skeleton } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';
import { listItems } from 'src/_mock/_big-card/_app/_dashboardBigCardListItems';
import { TrashTable } from 'src/app-sections/dashboard/components/table/trash-table/trash-table';
import { AddConnectionDialog } from 'src/app-sections/dashboard/components/dialogs/add-connection-dialog';
import { ConnectionsTable } from 'src/app-sections/dashboard/components/table/home-table/connections-table';
import { MainFolderTable } from 'src/app-sections/dashboard/components/table/main-folder/connections-table';

import { Iconify } from 'src/components/iconify';
import BigCard from 'src/components/big-card/big-card';
import { FolderSection } from 'src/components/folder/folder';
import StatsCard from 'src/components/stats-card/stats-card';
import PageHeader from 'src/components/page-header/page-header';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard | ${CONFIG.site.name}` };
const { items, style } = listItems;

export default function Page() {
  const [activeTable, setActiveTable] = useState('dashboard');
  const [selectedFolder, setSelectedFolder] = useState('Home');
  const [addConnectionDialog, setAddConnectionDialog] = useState(false);

  const handleTrashClick = () => {
    setActiveTable('trash');
  };

  // Handle home click to go back to dashboard table
  const handleHomeClick = () => {
    setActiveTable('dashboard');
    setSelectedFolder('Home'); // Reset to 'Home' when navigating back to dashboard
  };

  // Handle folder click to update selected folder name
  const handleFolderClick = (folderLabel) => {
    setSelectedFolder(folderLabel);
    if (folderLabel === 'Main Folder') {
      setActiveTable('mainFolder');
    }
  };

  const handleMainFolderClick = () => {
    setActiveTable('mainFolder');
    setSelectedFolder('Main Folder');
  };

  // Add Connection Dialog

  const AddConnection = () => {
    setAddConnectionDialog(true);
  };

  // Loader
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },

            justifyContent: 'space-between',
            mb: 0,
          }}
        >
          <PageHeader
            title="Dashboard"
            Subheading="Create, manage your connections in one place with Pabbly Hook. Track event usage & connection status easily."
            link_added="https://forum.pabbly.com/threads/what-is-pabbly-hook.25647/"
          />
          <Tooltip title="Click to add new connection." arrow placement="top" disableInteractive>
            <Button
              onClick={AddConnection}
              sx={{ mt: { xs: 2, lg: 0, } }}
              
              startIcon={
                <Iconify icon="heroicons:plus-circle-16-solid" style={{ width: 18, height: 18 }} />
              }
              size="large"
              variant="contained"
              color="primary"
            >
              Add Connection
            </Button>
          </Tooltip>
        </Box>
        {/* <MainStatsCard /> */}
        <Box
          sx={{
            mt: 5,
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
          <StatsCard
            cardtitle="Events Allotted"
            cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '10000'}
            icon_name="alloted.png"
            icon_color="#FFA92E"
            tooltip="Total number of events allotted to your account."
            bg_gradient="#FFA92E"
          />

          <StatsCard
            cardtitle="Events Consumed"
            cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '2000'}
            tooltip="Total number of events consumed by your account."
            icon_name="consumed.svg"
            icon_color="#10CBF3"
            bg_gradient="#10CBF3"
          />

          <StatsCard
            cardtitle="Events Remaining"
            tooltip="Total number of events remaining in your account."
            cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '8000'}
            icon_name="remaining.svg"
            icon_color="#1D88FA"
            bg_gradient="#1D88FA"
          />

          <StatsCard
            cardtitle="Total Connections Added"
            tooltip="Total number of connections in your account."
            cardstats={isLoading ? <Skeleton variant="text" width={100} height={48} /> : '210'}
            icon_name="added.svg"
            icon_color="#28A645"
            bg_gradient="#22C55E"
          />
        </Box>
        <Box
          sx={{
            mt: 4,
            gap: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '354px' }, position: { md: 'sticky' }, top: { md: '80px', xs: '0' }, zIndex: 1, alignSelf: 'flex-start' }}>
            <FolderSection
              onTrashClick={handleTrashClick}
              onHomeClick={handleHomeClick}
              onFolderClick={handleFolderClick}
              onMainFolderClick={handleMainFolderClick}
              selectedFolder={selectedFolder}
            />
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: 'calc(100% - 346px)' },
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <BigCard
              // tooltip="View file upload guidelines for email verification."
              getHelp={false}
              isVideo
              bigcardtitle="Points To Remember"
              bigcardsubtitle="Adding a connection is quick and easy. Just follow these three simple steps."
              style={style}
              items={items}
              videoLink="https://www.youtube.com/embed/YBEA1SjtwQ0?si=TWN5meKNkJCfmGk2"
              thumbnailName="pabbly-hook-video.png"
              learnMoreLink="https://forum.pabbly.com/threads/what-is-pabbly-hook.25647/"
              action={
                <Tooltip
                  title="Click to add new connection."
                  arrow
                  placement="top"
                  disableInteractive
                >
                  <Button
                    onClick={AddConnection}
                    startIcon={
                      <Iconify
                        icon="heroicons:plus-circle-16-solid"
                        style={{ width: 18, height: 18 }}
                      />
                    }
                    sx={{ mt: 3 }}
                    variant="outlined"
                    color="primary"
                    size="large"
                  >
                    Add Connection
                  </Button>
                </Tooltip>
              }
            />

            {activeTable === 'trash' ? (
              <TrashTable />
            ) : activeTable === 'mainFolder' ? (
              <MainFolderTable />
            ) : (
              <ConnectionsTable selectedFolder={selectedFolder} />
            )}
          </Box>
        </Box>
      </DashboardContent>
      <AddConnectionDialog
        open={addConnectionDialog}
        onClose={() => setAddConnectionDialog(false)}
      />
    </>
  );
}

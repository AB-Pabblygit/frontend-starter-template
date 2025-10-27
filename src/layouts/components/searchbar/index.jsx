import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import {
  Divider,
  Tooltip,
  TextField,
  Typography,
  DialogTitle,
  CircularProgress,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';

import { ResultItem } from './result-item';

// ----------------------------------------------------------------------
const data = [
  { title: 'Pixel & Co.', folderName: 'Home' },
  { title: 'Chop and Chill', folderName: 'Pabbly Connect' },

  // { title: 'Pabbly Subcription Billing Connection', folderName: 'Pabbly Subscription Billing' },
  // { title: 'Clothing customer data', folderName: 'Clothing Connections' },
  // { title: 'Stripe-Webhook', folderName: 'Stripe Connections' },
  // { title: 'Shopify-Orders-Connector', folderName: 'Shopify Connections' },
  // { title: 'Zendesk-Tickets-Integration', folderName: 'Zendesk Connections' },
  // { title: 'DataPipeline-Link', folderName: 'Pipeline Connections' },
];
export default function Searchbar({ sx, ...other }) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const navigate = useNavigate();
  // const onUpdateConnection = () => {
  //   navigate('/app/update-connection');
  // };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    navigate('/app/update-connection'); // Open update connection page
    handleClose(); // Close the dialog
  };
  

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderItems = () => (
    <Box component="ul">
      {filteredData.map((item) => (
        <Box
          component="li"
          key={item.title} // Use title for unique key instead of item.path
          sx={{ display: 'flex' }}
          // onClick={() => handleItemClick(item)} 
        >
          <ResultItem
            title={item.title}
            folderItems={item.folderName}
            groupLabel={searchQuery && 'Filtered'}
            searchQuery={searchQuery}
          />
        </Box>
      ))}
    </Box>
  );
  const renderButton = (
    <Tooltip title="You can search connection from here." arrow placement="bottom">
      <Box
        display="flex"
        alignItems="center"
        onClick={handleOpen}
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: 'grey.600',
          pr: { sm: 1 },
          borderRadius: { sm: 1.5 },
          cursor: { sm: 'pointer' },
          bgcolor: { sm: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
          ...sx,
        }}
        {...other}
      >
        <Box display="flex" alignItems="center">
          <IconButton disableRipple>
            <SvgIcon sx={{ width: 20, height: 20 }}>
              <path
                fill="currentColor"
                d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
              />
            </SvgIcon>
          </IconButton>
        </Box>
        <Box mr={1} sx={{ display: { xs: 'none', sm: 'block'  } }}>
          <Typography fontWeight={500} fontSize={14} py={1}>
            Business:
          </Typography>
        </Box>

        <Typography
          fontWeight={600}
          sx={{
            p: 0.5,
            borderRadius: 1,
            // ml: 1,
            fontSize: 12,
            color: 'grey.800',
            bgcolor: 'common.white',
            boxShadow: theme.customShadows.z1,
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          Pixel & Co.
        </Typography>
      </Box>
    </Tooltip>
  );

  return (
    <>
      {renderButton}

      <Dialog
        fullWidth
        disableRestoreFocus
        open={isOpen}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{
          [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' },
        }}
      >
        <Box>
          <DialogTitle sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
            Search Business
            <IconButton onClick={handleClose} sx={{ width: 24, height: 24 }}>
              <Iconify icon="uil:times" style={{ cursor: 'pointer', color: '#637381' }} />
            </IconButton>
          </DialogTitle>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </Box>
        <Box sx={{ p: 2 }}>
          <Tooltip title="Enter the business name." arrow placement="top">
            <TextField
              fullWidth
              size="large"
              placeholder="Search by business name..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" width={24} height={24} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <Iconify
                      icon="ic:round-clear"
                      style={{
                        cursor: 'pointer',
                        color: '#637381',
                      }}
                      onClick={handleClearSearch}
                    />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Tooltip>
        </Box>
        {/* Dialog Content */}

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <CircularProgress />
        </Box>

        {filteredData.length === 0 ? (
          // <SearchNotFound query={searchQuery} sx={{ py: 15 }} />
          <Box p={2}>
            <EmptyContent
              title="No Search Found"
              description={`No search found for ${searchQuery}`}
            />
          </Box>
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 0, height: 400 }}>{renderItems()}</Scrollbar>
        )}
      </Dialog>
    </>
  );
}

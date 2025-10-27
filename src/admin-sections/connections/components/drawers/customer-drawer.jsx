// import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Radio,
  Drawer,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  RadioGroup,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import StatsCards from 'src/components/stats-card/stats-card';



const CustomerDetailsDrawer = ({
  open,
  onClose,
  userName,
  userEmail,
  userStatus,
  onStatusChange,
}) => {
  const theme = useTheme();
  const [currentStatus, setCurrentStatus] = useState(userStatus);

  const handleBackdropClick = (event) => {
    // Prevent clicks inside the drawer from closing it
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const [creditsValue, setCreditsValue] = useState('addCredits');
  const handleCreditsChange = (event) => {
    const newcreditsValue = event.target.value;
    setCreditsValue(newcreditsValue);
    // Log the selected value
  };
  const [creditsFieldValue, setCreditsFieldValue] = useState(0);
  const handleCreditsFieldChange = (event) => {
    const newcreditsFieldValue = event.target.value;
    setCreditsFieldValue(newcreditsFieldValue);
    // Log the selected value
  };

  const handleIncrement = () => setCreditsFieldValue((prev) => prev + 1);
  const handleDecrement = () => setCreditsFieldValue((prev) => Math.max(0, prev - 1));

  const handleUpdateCredits = (event) => {
    event.preventDefault();
    if (creditsValue === 'addEvents') {
      toast.success(`${creditsFieldValue} events credited successfully.`);
    } else {
      toast.success(`${creditsFieldValue} events deducted successfully.`);
    }
    
    onClose()
  };

  useEffect(() => {
    if (userStatus) {
      setCurrentStatus(userStatus);
    }
  }, [userStatus, open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          width: {
            xs: '100%',
            md: 'auto',
            lg: '40%',
          }, // Adjust width as needed
        },
      }}
      // ModalProps={{
      //   BackdropComponent: CustomBackdrop, // Use the custom backdrop
      // }}
    >
      <Box
        onClick={handleBackdropClick} // Handle clicks outside the drawer
        display="flex"
        justifyContent="Space-between"
      >
        <Typography variant="h6">Customer Details</Typography>
        <IconButton
          onClick={onClose}
          // sx={{ top: 12, left: 12, zIndex: 9, position: 'unset' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>
      <Box
        sx={{
          mt: 3,

          gap: 3,
          display: 'grid',
          flexWrap: 'wrap',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        <StatsCards
          cardtitle="Events Remaining"
          cardstats="10,000"
          icon_name="remaining.svg"
          icon_color="#FFA92E"
          bg_gradient="#FFA92E"
          tooltip="Total number of events remaining for this customer."
        />
        <StatsCards
          cardtitle="Events Consumed"
          cardstats="0"
          icon_name="consumed.svg"
          icon_color="#28A645"
          bg_gradient="#28A645"
          tooltip="Total number of events consumed by this customer."
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader title="Customer" sx={{ mb: 3 }} />

          <Divider />
          <Form onSubmit={handleUpdateCredits}>
           
            <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
              <Box width="100%">
                <TextField
                  disabled
                  label="Pabbly Customer's Email"
                  value={userEmail}
                  fullWidth
                  type="text"
                  variant="outlined"
                />
              </Box>
            </Box>
           
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ px: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ pb: 2 }}>
                Update Event 
              </Typography>
              <RadioGroup
                row
                defaultValue="addEvents"
                value={creditsValue}
                onChange={handleCreditsChange}
              >
                <FormControlLabel
                  value="addEvents"
                  control={<Radio checked size="small" />}
                  label="Add Events"
                />
                <FormControlLabel
                  value="subtractEvents"
                  control={<Radio size="small" />}
                  label="Deduct Events"
                />
              </RadioGroup>
              {/* <Form onSubmit={handleUpdateCredits}> */}
                <TextField
                  sx={{ mt: 3 }}
                  value={creditsFieldValue}
                  onChange={(e) => setCreditsFieldValue(Number(e.target.value))}
                  fullWidth
                  label="Enter Event"
                  type="number"
                  variant="outlined"
                  helperText="Enter the number of event to add or deduct for the Pabbly customer account."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          sx={{ cursor: 'pointer' }}
                        >
                          <Iconify onClick={handleIncrement} icon="icon-park-solid:up-one" />
                          <Iconify onClick={handleDecrement} icon="icon-park-solid:down-one" />
                        </Box>
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 },
                  }}
                />
                <Button
                  sx={{ mt: 3 }}
                  variant="contained"
                  color="primary"
                  type="submit" // Ensures the form's onSubmit is triggered
                  onClick={handleUpdateCredits}
                >
                  Update
                </Button>
              {/* </Form> */}
            </Box>
          </Form>
        </Card>
      </Box>
    </Drawer>
  );
};

export { CustomerDetailsDrawer };

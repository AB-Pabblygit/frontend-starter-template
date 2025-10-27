import { toast } from 'sonner';
import React, { useState } from 'react';

import {
  Box,
  Card,
  Drawer,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  CardHeader,
  Backdrop as MuiBackdrop,
} from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';


// Custom backdrop component
const CustomBackdrop = (props) => (
  <MuiBackdrop {...props} sx={{ backgroundColor: 'transparent' }} />
);

const AddNoteDrawer = ({ open, onClose, rowData }) => {
  const [isSimpleData, setIsSimpleData] = useState(false);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const bodyData = {
    apiKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NzRhZDgwMzU2MDZjMTM1Zjk5NTgxZiIsIm5hbWUiOiJBaVNlbnN5IERlbW8gQWNjb3VudCIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2MzAyOWM3Mjg1ODcxODUxYTQ5MzJmNTgiLCJhY3RpdmVQbGFuIjoiUFJPX01PTlRITFkiLCJpYXQiOjE3MjgzNzQ5ODV9.6N7-Y7rYAIkyYkf_ti5TRfCChwKyWY0Gai5tzP2QnVI',
    campaignName: 'New Camp 16 Oct',
    destination: '919581984489',
    userName: 'Pabbly Hook Account',
    templateParams: ['$FirstName', '$FirstName'],
    source: 'new-landing-page form',
    media: {},
    buttons: [],
    carouselCards: [],
    location: {},
    paramsFallbackValue: {
      FirstName: 'user',
    },
  };

  const queryParamsData = {
    discountApplied: 'false',
    currency: 'EUR',
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(JSON.stringify(bodyData, null, 2))
      .then(() => {
        toast.success('Event data copied successfully.');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
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
              lg: '50%',
            },
          },
        }}
        ModalProps={{
          BackdropComponent: CustomBackdrop,
        }}
      >
        <Box
          onClick={handleBackdropClick}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6">Add Connection Note</Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '14px', fontWeight: 400 }}>
            You can add notes for the connection you have created.{' '}
              <a href="#" style={{ color: '#078DEE', textDecoration: 'underline' }}>
                Learn more
              </a>
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ top: 12, left: 12, zIndex: 9 }}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardHeader
              title="Connection Name: Google form to google sheets connection"
              subheader={
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Folder Name: Home{' '}
                </Typography>
              }
            />
            <Divider />
            <Form>
              <Box sx={{ px: 3, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    multiline
                    rows={6}
                    placeholder="Enter your notes here."
                    label="Connection Note"
                    fullWidth
                    type="text"
                    variant="outlined"
                    helperText="Enter a note here. The note will help you understand how and why you&apos;ve
                        built it."
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2, mt: 2 }} display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={() => {
                    onClose();
                    toast.success(`Successfully added note to the connection.`, {
                      style: {
                        marginTop: '15px',
                      },
                    });
                  }}
                >
                  Save
                </Button>
              </Box>
            </Form>
          </Card>
        </Box>
      </Drawer>
      {open && <CustomBackdrop open={open} onClick={handleBackdropClick} />}
    </>
  );
};

export { AddNoteDrawer };

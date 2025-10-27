import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import React, { useMemo, useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import {
  Select,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';

import { CustomDialog } from 'src/components/custom-dialog/custom-dialog';

// ----------------------------------------------------------------------

export function WebhookDialog({ open, onClose, webhookToEdit }) {
  const theme = useTheme();
  const isEditMode = !!webhookToEdit;

  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const events = useMemo(
    () => [
      { id: 'event1', label: 'New Message Recieved' },
      { id: 'event2', label: 'On message status change lik: delivered, read' },
      { id: 'event3', label: 'Contact create' },
      { id: 'event4', label: 'Contact update' },
      { id: 'event5', label: 'Contact delete' },
      { id: 'event6', label: 'Broadcast sent' },
      // Add more events as needed
    ],
    []
  );

  useEffect(() => {
    if (isEditMode && webhookToEdit) {
      const eventObject = events.find((e) => e.label === webhookToEdit.webhookEvent);
      setWebhookName(webhookToEdit.name || '');
      setWebhookUrl(webhookToEdit.webhookUrl || '');
      setWebhookEvent(eventObject ? eventObject.id : '');
    } else {
      setWebhookName('');
      setWebhookUrl('');
      setWebhookEvent('');
    }
  }, [isEditMode, webhookToEdit, open, events]);

  const handleSave = () => {
    // Implement your logic to add/update webhook here
    // For example, you might want to validate the inputs first

    // Show the snackbar
    setSnackbarOpen(true);

    // Close the dialog after a short delay
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const dialogContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <TextField
        fullWidth
        type="text"
        margin="dense"
        variant="outlined"
        label="Webhook Name"
        value={webhookName}
        onChange={(e) => setWebhookName(e.target.value)}
        helperText={
          <span>
            Enter the name of the webhook.{' '}
            <Link to="#" style={{ color: '#078DEE' }}>
              Learn more
            </Link>
          </span>
        }
      />
      <TextField
        fullWidth
        type="text"
        margin="dense"
        variant="outlined"
        label="Webhook URL"
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        helperText={
          <span>
            Ensure that the webhook URL is correct.{' '}
            <Link to="#" style={{ color: '#078DEE' }}>
              Learn more
            </Link>
          </span>
        }
      />
      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel>Webhook Event</InputLabel>
        <Select
          label="Webhook Event"
          value={webhookEvent}
          onChange={(e) => setWebhookEvent(e.target.value)}
        >
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Select the event for which you want to be notified.{' '}
          <Link to="#" style={{ color: '#078DEE' }}>
            Learn more
          </Link>
        </FormHelperText>
      </FormControl>
    </div>
  );

  const dialogActions = (
    <>
      <Tooltip
        title={isEditMode ? 'Click here to save changes' : 'click here to add opt-out webhook.'}
        arrow
        placement="top"
      >
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditMode ? 'Save Changes' : 'Add'}
        </Button>
      </Tooltip>
      <Tooltip title="click here close" arrow placement="top">
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </Tooltip>
    </>
  );

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Webhook' : 'Add Webhook'}
      content={dialogContent}
      action={dialogActions}
    />
  );
}

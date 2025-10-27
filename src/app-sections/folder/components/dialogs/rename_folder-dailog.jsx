import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Dialog,
  Button,
  Divider,
  Tooltip,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import LearnMoreLink from 'src/components/learn-more-link/learn-more-link';

export function RenameFolderDialog({ open, onClose, connectionName }) {
  const [newConnectionName, setNewConnectionName] = useState(connectionName); 
  const [hasError, setHasError] = useState(false); 
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();

  useEffect(() => {
    setNewConnectionName(connectionName); 
  }, [connectionName]);

  const handleAdd = () => {
    if (!newConnectionName.trim()) {
      setHasError(true);
      return; 
    }
    setHasError(false);
    toast.success(`Folder renamed successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
    onClose(); 
  };

  const handleNameChange = (event) => {
    setNewConnectionName(event.target.value); 
    if (event.target.value.trim()) {
      setHasError(false); 
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={dialog.onFalse}
      >
        Rename Folder
      </DialogTitle>
      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              autoFocus
              fullWidth
              type="text"
              margin="dense"
              variant="outlined"
              label="Folder Name"
              value={newConnectionName} 
              onChange={handleNameChange} 
              error={hasError} 
              helperText={
                hasError ? (
                  'Please enter folder name.'
                ) : (
                  <span>
                    You can rename folder from here.{' '}
                    <LearnMoreLink link='https://forum.pabbly.com/threads/how-to-manage-folders-in-pabbly-hook.25680/'/>
                  </span>
                )
              }
            />
        </Box>
      </DialogContent>

      <DialogActions>
        <Tooltip
          title="Click here to update the new name of the folder."
          arrow
          placement="top"
          disableInteractive
        >
          <Button onClick={handleAdd} variant="contained" color="primary">
            Update
          </Button>
        </Tooltip>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

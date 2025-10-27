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

export function CreateFolderDialog({ title, content, action, open, onClose, ...other }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState(false);
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();

  const handleAdd = () => {
    let hasError = false;

    if (!folderName.trim()) {
      setError(true);
      hasError = true;
    }

    if (!hasError) {
      toast.success(`Folder has been created successfully.`, {
        style: {
          marginTop: '15px',
        },
      });
      setError(false);
      onClose();
    }
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
    if (event.target.value) {
      setError(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFolderName('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={dialog.onFalse}
      >
        Create Folder
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
            value={folderName}
            onChange={handleFolderNameChange}
            error={error}
            helperText={
              error ? (
                'Enter folder name here.'
              ) : (
                <span>
                  Enter the name of the folder here.{' '}
                  <LearnMoreLink link="https://forum.pabbly.com/threads/how-to-manage-folders-in-pabbly-hook.25680/" />
                </span>
              )
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Tooltip title="Click here to Create folder." arrow placement="top" disableInteractive>
          <Button onClick={handleAdd} color="primary" variant="contained">
            Create Folder
          </Button>
        </Tooltip>
        <Tooltip title="Click here to close." arrow placement="top" disableInteractive>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

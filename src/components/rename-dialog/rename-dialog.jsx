import { toast } from 'sonner';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';

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

export function RenameDialog({ open, onClose }) {
  const [newName, setNewName] = useState('');
  const [hasError, setHasError] = useState(false);
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();

  const handleRename = () => {
    if (!newName.trim()) {
      setHasError(true);
      return;
    }
    setHasError(false);
    toast.success('  Renamed successfully.');
    onClose();
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
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
        Rename  
      </DialogTitle>
      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* <Tooltip title="  Name" arrow placement="top"> */}
            <TextField
              autoFocus
              fullWidth
              type="text"
              margin="dense"
              variant="outlined"
              label="New Name"
              value={newName}
              onChange={handleNameChange}
              error={hasError}
              helperText={
                hasError ? (
                  'Please enter connection name.'
                ) : (
                  <span>
                    Enter new connection name here.{' '}
                    {/* <Tooltip
                      title="If you have any doubt in this click learn more as it contains the forum Support"
                      arrow
                      placement="top"
                    > */}
                      <Link href="#" style={{ color: '#078DEE' }} underline="always">
                        Learn more
                      </Link>
                    {/* </Tooltip> */}
                  </span>
                )
              }
            />
          {/* </Tooltip> */}
        </Box>
      </DialogContent>

      <DialogActions>
        <Tooltip title="Click here to rename." arrow placement="top">
          <Button onClick={handleRename} variant="contained" color="primary">
            Update
          </Button>
        </Tooltip>
        <Tooltip title="Click here to close." arrow placement="top">
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

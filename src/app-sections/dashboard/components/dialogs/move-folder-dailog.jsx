import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
  Divider,
  Tooltip,
  TextField,
  Autocomplete,
  useMediaQuery,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import LearnMoreLink from 'src/components/learn-more-link/learn-more-link';

export function MoveToFolderPopover({ title, content, action, open, onClose, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const [hasError, setHasError] = useState(false);

  const dialog = useBoolean();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categorylist, setCategorytList] = useState('Home'); // Default to "Home"
  const [categoryError, setCategoryError] = useState(false);

  const handleChangeCategoryList = useCallback((event, value) => {
    setCategorytList(value);
    if (value) {
      setCategoryError(false);
    }
  }, []);

  const folder = ['Home', 'Pabbly Connect', 'Main Folder'];

  const handleAdd = () => {
    if (!categorylist) {
      setCategoryError(true);
      return;
    }
    toast.success(`Connection(s) moved successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
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

  const handleDialogClose = () => {
    setSnackbarOpen(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={dialog.onFalse}
      >
        Move To Folder
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent>
        <Autocomplete
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '14px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
            },
            mt: 1.2,
          }}
          options={folder}
          value={categorylist} // Default to Home
          onChange={handleChangeCategoryList}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<span>Select Folder</span>}
              helperText={
                <span>
                  {categoryError ? (
                    'Please select a required folder.'
                  ) : (
                    <>
                      Select the folder where you want to move the connection.{' '}
                      <LearnMoreLink link='https://forum.pabbly.com/threads/how-to-manage-folders-in-pabbly-hook.25680/' />
                    </>
                  )}
                </span>
              }
              error={categoryError}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        {action}
        <Tooltip title="Click here to move the connection to existing folder." arrow disableInteractive placement="top">
          <Button onClick={handleAdd} variant="contained" color="primary">
            Move
          </Button>
        </Tooltip>
        <Tooltip title="Click here to close" arrow placement="top" disableInteractive>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

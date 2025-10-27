import { useTheme } from '@emotion/react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, useMediaQuery } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


export function CustomDialog({ title, content, action, open, onClose, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));

  // Function to reset all the states when closing the dialog

  // Define common styles
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose(event, reason);
      }}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
      >
        {title}{' '}
        
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent>{content}</DialogContent>

      <DialogActions>
        {action}
      </DialogActions>
    </Dialog>
  );
}
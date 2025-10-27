import { toast } from 'sonner';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
  Box,
  Divider,
  Tooltip,
  TextField,
  Autocomplete,
  useMediaQuery,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import LearnMoreLink from 'src/components/learn-more-link/learn-more-link';

export function AddConnectionDialog({ title, content, action, open, onClose, ...other }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();

  // Folder options
  const folder = [
    { value: '1', label: 'Home' },
    { value: '2', label: 'Company B' },
    { value: '3', label: 'WhatsApp Database' },
  ];

  // Form states
  const [formData, setFormData] = useState({
    connectionName: '',
    folderList: folder[0], // Set default to 'Home'
  });

  const [formErrors, setFormErrors] = useState({
    connectionName: false,
    folderList: false,
  });

  // Handle connection name change
  const handleConnectionNameChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, connectionName: value }));
    setFormErrors((prev) => ({ ...prev, connectionName: !value }));
  };

  // Handle folder selection change
  const handleChangeCategoryList = (event, value) => {
    setFormData((prev) => ({ ...prev, folderList: value }));
    setFormErrors((prev) => ({ ...prev, folderList: !value }));
  };

  // Get folder name from selected value
  const getFolderName = (value) => {
    const selectedFolder = folder.find((option) => option.value === value);
    return selectedFolder ? selectedFolder.label : '';
  };

  // Validate form and handle submission
  const handleSubmit = () => {
    const newErrors = {
      connectionName: !formData.connectionName,
      folderList: !formData.folderList,
    };

    setFormErrors(newErrors);

    if (!newErrors.connectionName && !newErrors.folderList) {
      toast.success('Connection created successfully.');
      navigate('/app/connection', {
        state: {
          connectionName: formData.connectionName,
          folderName: getFolderName(formData.folderList),
        },
      });
      handleDialogClose();
    }
  };

  const handleDialogClose = () => {
    setFormData({ connectionName: '', folderList: folder[0] }); // Reset to default 'Home'
    setFormErrors({ connectionName: false, folderList: false });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      {...other}
      PaperProps={{ style: { minWidth: isWeb ? '600px' : '330px' } }}
    >
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        Add Connection
      </DialogTitle>
      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
      <DialogContent
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter') {
        //     e.preventDefault(); // Prevent form submission behavior
        //     handleSubmit();
        //   }
        // }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            label="Connection Name"
            value={formData.connectionName}
            onChange={handleConnectionNameChange}
            error={formErrors.connectionName}
            helperText={
              formErrors.connectionName
                ? 'Connection name is required.'
                : 'Enter the name of the connection.'
            }
          />

          <Autocomplete
            sx={{ '& .MuiInputBase-input': { fontSize: '14px' } }}
            options={folder}
            getOptionLabel={(option) => option.label}
            value={formData.folderList}
            onChange={handleChangeCategoryList}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Folder"
                error={formErrors.folderList}
                helperText={
                  <span>
                    {formErrors.folderList
                      ? 'You must select a folder.'
                      : 'Select the folder where you want to add the connection.'}{' '}
                    <LearnMoreLink link="https://forum.pabbly.com/threads/how-to-manage-folders-in-pabbly-hook.25680/" />
                  </span>
                }
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Tooltip title="Click here to add new connection." placement="top" disableInteractive arrow>
          <Button  variant="contained" color="primary">
            Add
          </Button>
        </Tooltip>
        <Tooltip title="Click here to close." placement="top" disableInteractive arrow>
          <Button onClick={handleDialogClose} variant="outlined" color="inherit">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

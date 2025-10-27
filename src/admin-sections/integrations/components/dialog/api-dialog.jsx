import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Button,
  Dialog,
  Divider,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

export default function AddApiDialog({
  open,
  onClose,
  mode = 'add',
  initialData = null,
  onSubmitSuccess,
}) {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  const secret_key = useBoolean();

  const [formData, setFormData] = useState({
    name: '',
    secret_key: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({
    name: '',
    secret_key: '',
  });
  const theme = useTheme();
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          secret_key: initialData.secret_key || '',
          status: initialData.status || 'active',
        });
      } else {
        setFormData({
          name: '',
          secret_key: '',
          status: 'active',
        });
      }
      setErrors({
        name: '',
        secret_key: '',
      });
    }
  }, [open, mode, initialData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.secret_key.trim()) {
      newErrors.secret_key = 'Secret key is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitting form:', formData);

      onClose();
      onSubmitSuccess(
        mode === 'edit'
          ?
          toast.success('Integrated application updated successfully.')

          :
          toast.success('Integrated application created successfully.')

      );
     
    }
  };


  const handleCopy = () => {
    if (formData.secret_key.trim()) {
      navigator.clipboard
        .writeText(formData.secret_key)
        .then(() => {
          console.log('Secret key copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy secret key:', error);
        });
    }
  };

  return (
    <>
      {' '}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {mode === 'edit' ? 'Update Integrated Application' : 'Integrate Application'}
              </Typography>

            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Card>
              <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="Integrate Application Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    // helperText={errors.name}
                    helperText={
                      <span>
                        Enter the name of the third-party email verification application whose API
                        will be used.{' '}
                       
                      </span>
                    }
                    placeholder="Enter Integrate Application Name"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      style: {
                        color: mode === 'add' ? 'black' : 'initial',
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="Secret Key"
                    value={formData.secret_key}
                    onChange={handleChange('secret_key')}
                    error={!!errors.secret_key}
                    // helperText={errors.secret_key}
                    helperText={
                      <span>
                        Enter the API key of the third-party email verification application being
                        used.
                       
                      </span>
                    }
                    placeholder="Enter secret key"
                    fullWidth
                    variant="outlined"
                    type={secret_key.value ? 'text' : 'password'}
                    InputProps={{
                      style: {
                        color: mode === 'add' ? 'black' : 'initial',
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleCopy} edge="end">
                            <Iconify icon="solar:copy-bold" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="Status"
                    placeholder="Select Status"
                    select
                    fullWidth
                    helperText={
                      <span>
                        Active means the API will be used to verify email lists uploaded
                        by Pabbly customers, while Inactive means the API will not be
                        used for email verification.{' '}
                       
                      </span>
                    }
                    value={formData.status}
                    onChange={handleChange('status')}
                    variant="outlined"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
              <DialogActions>
                <Button size="medium" variant="contained" color="primary" onClick={handleSubmit}>
                  {mode === 'edit' ? 'Update' : 'Add'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Close
                </Button>
              </DialogActions>
            </Card>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

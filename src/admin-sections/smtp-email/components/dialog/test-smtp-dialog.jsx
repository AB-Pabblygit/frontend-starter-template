import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
} from '@mui/material';

export default function TestSmtpDialog({
  open,
  onClose,
  mode = 'add',
  initialData = null,
  onSubmitSuccess,
}) {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTest = async () => {
    if (validateForm()) {
      onClose();
      const success = Math.random() < 0.5; // 50% chance of success for demonstration

      if (success) {
        toast.success(
          'Test email sent successfully. Your SMTP configuration is working as expected.'
        );
      } else {
        toast.error('Test email failed to send. Please check your SMTP settings and try again.');
      }
    }
  };

  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
      });
      setErrors({
        email: '',
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Test SMTP</Typography>
            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Card>
              <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={
                      errors.email ||
                      'Enter your email address to receive a test email and confirm SMTP functionality. E.g. hardik@pabbly.com'
                    }
                    placeholder="Enter email address"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>
              <DialogActions>
                <Button size="medium" variant="contained" color="primary" onClick={handleTest}>
                  Send Test Email
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Close
                </Button>
              </DialogActions>
            </Card>
          </Box>
        </Box>
      </Dialog>
  );
}

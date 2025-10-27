import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Button,
  TextField,
  Typography,
  Autocomplete,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';

import { CustomDialog } from 'src/components/custom-dialog/custom-dialog';
import LearnMoreLink from 'src/components/learn-more-link/learn-more-link';

export function TeamMemberDialog({ open, onClose, currentMember, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [autocompleteError, setAutocompleteError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryList, setCategoryList] = useState(null);
  const [categoryError, setCategoryError] = useState(false);

  const folder = ['Read Access', 'Write Access'];
  const folders = [
    'Select All Folders',
    'Pabbly Connect',
    'Main Folder',
    'Folder 1',
    'Folder 2',
    'Folder 3',
  ];
  const folderOptions = folders.slice(1); // All folders except "Select All Folders"

  // Set initial values when currentMember changes
  useEffect(() => {
    if (currentMember) {
      setEmail(currentMember.email || '');
      // Split the folders string into an array if it contains multiple folders
      const folderArray = currentMember.folders_you_shared
        ? currentMember.folders_you_shared.split(',').map((f) => f.trim())
        : [];
      setSelectedItems(folderArray);
      setCategoryList(currentMember.permission || null);
    }
  }, [currentMember]);

  const handleClose = () => {
    if (!currentMember) {
      setEmail('');
      setSelectedItems([]);
      setCategoryList(null);
    }
    setEmailError(false);
    setAutocompleteError(false);
    setCategoryError(false);
    onClose();
  };

  const ALLOWED_EMAILS = [
    'hardik@pabbly.com',
    'kamal.kumar@pabbly.com',
    'abhishek.nagar@pabbly.com',
    'neeraj.agarwal@pabbly.com',
    'ankit.mandli@pabbly.com',
    'krishna.thapa@pabbly.com',
    'pankaj.agarwal@pabbly.com'
    // ... other allowed emails
  ];

  const commonBoxStyle = { ml: '9px' };
  const commonTypographyStyle = { fontSize: '14px', color: 'grey.800', mt: 1, mb: 1, ml: '5px' };
  const commonUlStyle = { paddingLeft: '20px', color: 'grey.600', fontSize: '12px' };
  const commonLiStyle = {
    marginBottom: '8px',
    fontWeight: '500',
    listStyleType: 'disc',
    listStylePosition: 'outside',
    color: '#637381',
  };

  const isEmailValid = (email1) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email1);
  };

  const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(!value || !isEmailValid(value));
  };

  const handleChangeCategoryList = (event, newValue) => {
    setCategoryList(newValue);
    setCategoryError(!newValue);
  };

  const handleFolderSelection = (event, newValue) => {
    setAutocompleteError(false);

    // Check if "Select All Folders" is being added
    if (newValue.includes('Select All Folders')) {
      setSelectedItems(folderOptions);
    }
    // Check if "Select All Folders" is being removed
    else if (
      selectedItems.length === folderOptions.length &&
      newValue.length < folderOptions.length
    ) {
      setSelectedItems([]);
    }
    // Normal selection
    else {
      setSelectedItems(newValue.filter((item) => item !== 'Select All Folders'));
    }
  };

  const handleAdd = () => {
    let hasError = false;

    // Skip email validation when updating
    if (!currentMember) {
      if (!email || !isEmailValid(email)) {
        setEmailError(true);
        hasError = true;
      }

      // Check if email is in allowed list (only for new members)
      if (!ALLOWED_EMAILS.includes(email)) {
        toast.error(`This email is not registered with Pabbly!`, {
          style: {
            marginTop: '15px',
          },
        });
        return;
      }
    }

    // Validate folder selection
    if (selectedItems.length === 0) {
      setAutocompleteError(true);
      hasError = true;
    }

    // Validate permissions
    if (!categoryList) {
      setCategoryError(true);
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        `${currentMember ? 'Team member updated successfully.' : 'Team member added successfully.'}`,
        {
          style: {
            marginTop: '15px',
          },
        }
      );
      handleClose();
      setIsLoading(false);
    }, 1200);
  };

  const dialogContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        autoFocus={!currentMember}
        fullWidth
        type="email"
        margin="dense"
        variant="outlined"
        label="Pabbly Account Email Address"
        placeholder="sample@example.com"
        value={email}
        onChange={handleChangeEmail}
        error={emailError}
        disabled={Boolean(currentMember)}
        helperText={
          emailError ? (
            email ? (
              'Please enter a valid email address.'
            ) : (
              'Email address is required.'
            )
          ) : (
            <span>
              Ensure that the email address is already registered with Pabbly.{' '}
              <LearnMoreLink link="https://forum.pabbly.com/threads/what-is-team-members-in-pabbly-hook.26905/" />
            </span>
          )
        }
      />

      <Autocomplete
        multiple
        options={folders}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Folder"
            placeholder="Select"
            error={autocompleteError}
            helperText={
              autocompleteError ? (
                'Please select at least one folder.'
              ) : (
                <span>
                  Select folders to be shared. Use &quot;Select All Folders&quot; to select all
                  at once.{' '}
                  <LearnMoreLink link="https://forum.pabbly.com/threads/what-is-team-members-in-pabbly-hook.26905/" />
                </span>
              )
            }
          />
        )}
        renderTags={(selected, getTagProps) =>
          selected.map(
            (option, index) =>
              option !== 'Select All Folders' && (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  variant="soft"
                  color="info"
                />
              )
          )
        }
        value={selectedItems}
        onChange={handleFolderSelection}
      />

      <Autocomplete
        options={folder}
        value={categoryList}
        onChange={handleChangeCategoryList}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Access Type"
            error={categoryError}
            helperText={
              categoryError ? (
                'Please select a permission level.'
              ) : (
                <span>
                  Select the team member access type.{' '}
                  <LearnMoreLink link="https://forum.pabbly.com/threads/what-is-team-members-in-pabbly-hook.26905/" />
                </span>
              )
            }
          />
        )}
      />

      {/* Points to Remember Section */}
      <Box sx={commonBoxStyle}>
        <Typography variant="subtitle1" sx={commonTypographyStyle}>
          Points To Remember
        </Typography>
        <ul style={commonUlStyle}>
          <li style={commonLiStyle}>
            <span>Ensure the team member has a registered Pabbly account before sharing access.</span>
          </li>
          <li style={commonLiStyle}>
            <span>
            You can share multiple folders with team members, but not individual connections.
            </span>
          </li>
          <li style={commonLiStyle}>
            <span>
            Assign an access type as either &quot;Read&quot; or &quot;Write&quot; when sharing folders.
            </span>
          </li>
          <li style={commonLiStyle}>
            <span>
            Team members cannot access the &quot;Settings&quot; page or the &quot;Trash&quot; folder.
            </span>
          </li>
          <li style={commonLiStyle}>
            <span>
            Team members cannot delete folders, connections, or move connections between folders.{' '}
            </span>
            <LearnMoreLink link="https://forum.pabbly.com/threads/what-is-team-members-in-pabbly-hook.26905/" />
          </li>
        </ul>
      </Box>
    </Box>
  );

  const dialogActions = (
    <>
      <Button onClick={handleAdd} disabled={isLoading} variant="contained" color="primary">
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : currentMember ? (
          'Update'
        ) : (
          'Add'
        )}
      </Button>
      <Button onClick={onClose} variant="outlined" color="inherit">
        Cancel
      </Button>
    </>
  );

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title={currentMember ? 'Update Team Member' : 'Add Team Member'}
      content={dialogContent}
      action={dialogActions}
      {...other}
    />
  );
}
